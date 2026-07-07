'use client';

/**
 * ParcelWrapper
 *
 * Componente genérico que carrega e monta um parcel Single SPA.
 *
 * Fluxo:
 * 1. Injeta <script src={spaUrl}> no DOM (uma vez por URL)
 * 2. Aguarda o bundle expor { bootstrap, mount, unmount } em window[name]
 * 3. Chama mount() passando domElement + customProps
 * 4. No cleanup, chama unmount()
 *
 * O React/ReactDOM do remote é fornecido pelo shell via window.React /
 * window.ReactDOM — declarados como externals no webpack.spa.js de cada remote.
 */

import React, { useEffect, useRef, useState } from 'react';

export interface SingleSpaLifecycles {
  bootstrap: (props: Record<string, unknown>) => Promise<void>;
  mount: (props: Record<string, unknown> & { domElement: Element }) => Promise<void>;
  unmount: (props: Record<string, unknown> & { domElement: Element }) => Promise<void>;
}

export interface ParcelWrapperProps {
  /** URL do spa.js servido pelo remote (ex: http://localhost:3001/spa.js) */
  spaUrl: string;
  /** Chave em window onde o bundle expõe os lifecycles (ex: "dashboard") */
  name: string;
  /** Props passadas ao parcel no momento do mount */
  customProps?: Record<string, unknown>;
  /** Classes CSS aplicadas ao container div */
  className?: string;
  /** Conteúdo mostrado enquanto o parcel carrega */
  fallback?: React.ReactNode;
}

// Rastreia scripts já injetados para não duplicar
const injectedScripts = new Set<string>();

export const ParcelWrapper: React.FC<ParcelWrapperProps> = ({
  spaUrl,
  name,
  customProps = {},
  className = '',
  fallback = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'mounted' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  // Ref para controlar ciclo de vida sem re-renderizar
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let lifecycles: SingleSpaLifecycles | null = null;

    const mountParcel = async () => {
      console.log(`[LOG] ⬆️  ParcelWrapper MOUNT iniciando: "${name}"`);
      try {
        // 1. Injetar script se ainda não foi injetado
        if (!injectedScripts.has(spaUrl)) {
          await loadScript(spaUrl);
          injectedScripts.add(spaUrl);
        }

        // 2. Aguardar o bundle expor os lifecycles em window[name]
        lifecycles = await waitForLifecycles(name);

        // 3. Bootstrap (executado uma vez por parcel)
        await lifecycles.bootstrap({ name, ...customProps });

        // 4. Mount passando o domElement
        await lifecycles.mount({ name, domElement: container, ...customProps });

        mountedRef.current = true;
        setStatus('mounted');
        console.log(`[LOG] ✅ ParcelWrapper MOUNT concluído: "${name}"`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[ParcelWrapper] Erro ao montar "${name}":`, msg);
        setErrorMessage(msg);
        setStatus('error');
      }
    };

    mountParcel();

    // Cleanup: unmount ao desmontar o componente React
    return () => {
      if (mountedRef.current && lifecycles) {
        console.log(`[LOG] ⬇️  ParcelWrapper UNMOUNT: "${name}"`);
        mountedRef.current = false;
        lifecycles.unmount({ name, domElement: container }).catch((err) => {
          console.warn(`[ParcelWrapper] Erro ao desmontar "${name}":`, err);
        });
      }
    };
    // customProps é passado por referência estável via useMemo nas páginas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaUrl, name]);

  // Atualiza props no parcel já montado quando customProps muda
  useEffect(() => {
    if (!mountedRef.current || !containerRef.current) return;
    const lifecycles = getLifecycles(name);
    if (!lifecycles) return;
    console.log(`[LOG] 🔄 ParcelWrapper props-update (unmount+remount): "${name}"`);
    // Re-mount com props atualizadas
    const container = containerRef.current;
    lifecycles.unmount({ name, domElement: container })
      .then(() => lifecycles.mount({ name, domElement: container, ...customProps }))
      .catch((err) => console.warn('[ParcelWrapper] Erro ao atualizar props:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customProps]);

  return (
    <div className={className} style={{ minHeight: status === 'loading' ? '120px' : undefined }}>
      {status === 'loading' && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '1.3rem' }}>
          {fallback ?? 'Carregando microfrontend...'}
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '1.3rem' }}>
          <strong>Erro ao carregar microfrontend &ldquo;{name}&rdquo;.</strong>
          <br />
          <span style={{ fontSize: '1.1rem', color: '#6b7280' }}>{errorMessage}</span>
          <br />
          <span style={{ fontSize: '1.1rem', color: '#6b7280' }}>
            Verifique se o remote está rodando em {spaUrl.replace('/spa.js', '')}.
          </span>
        </div>
      )}
      {/* O parcel monta seus elementos diretamente neste div */}
      <div ref={containerRef} style={{ display: status === 'mounted' ? 'block' : 'none' }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falha ao carregar script: ${src}`));
    document.head.appendChild(script);
  });
}

function waitForLifecycles(
  name: string,
  retries = 20,
  interval = 200,
): Promise<SingleSpaLifecycles> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      const lc = getLifecycles(name);
      if (lc) { resolve(lc); return; }
      attempts++;
      if (attempts >= retries) {
        reject(new Error(`Lifecycles de "${name}" não encontrados em window após ${retries} tentativas.`));
        return;
      }
      setTimeout(check, interval);
    };
    check();
  });
}

function getLifecycles(name: string): SingleSpaLifecycles | null {
  const w = window as unknown as Record<string, unknown>;
  const lc = w[name] as SingleSpaLifecycles | undefined;
  if (lc && typeof lc.bootstrap === 'function' && typeof lc.mount === 'function') {
    return lc;
  }
  return null;
}
