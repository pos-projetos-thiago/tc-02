/**
 * Página de teste simples para IA
 */

'use client';

import React, { useState } from 'react';

export default function TestAIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testWithSampleText = async () => {
    setLoading(true);
    try {
      const sampleFile = new Blob(['Depositar R$10,00 na conta; Sacar R$2,00 da conta.'], {
        type: 'text/plain'
      });
      
      const formData = new FormData();
      formData.append('file', sampleFile, 'teste.txt');
      
      const response = await fetch('/api/ai-document', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Resposta da API:', data);
      setResult(data);
    } catch (error) {
      console.error('Erro no teste:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧪 Teste da IA</h1>
      
      <button 
        onClick={testWithSampleText}
        disabled={loading}
        style={{ 
          padding: '1rem 2rem', 
          fontSize: '1.2rem',
          background: loading ? '#ccc' : '#004D61',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testando...' : 'Testar com: "Depositar R$10,00; Sacar R$2,00"'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <h3>Resultado:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}