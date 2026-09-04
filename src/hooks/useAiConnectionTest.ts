import { useState, useCallback } from 'react';
import { AIProviderSettings, AIConnectionTestResult } from '../types/ai';
import { testAIConnection } from '../core/ai-service';

export function useAiConnectionTest() {
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<AIConnectionTestResult | null>(null);

  const runConnectionTest = useCallback(async (settings: AIProviderSettings) => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const result = await testAIConnection(settings);
      setTestResult(result);
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const errorResult: AIConnectionTestResult = {
        success: false,
        message: `Failed: ${msg}`,
      };
      setTestResult(errorResult);
      return errorResult;
    } finally {
      setTestingConnection(false);
    }
  }, []);

  const clearTestResult = useCallback(() => {
    setTestResult(null);
  }, []);

  return {
    testingConnection,
    testResult,
    setTestResult,
    statusMessage: testResult?.message ?? null,
    runConnectionTest,
    clearTestResult,
  };
}
