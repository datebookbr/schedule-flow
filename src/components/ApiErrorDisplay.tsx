import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ApiError } from '@/lib/api';

interface ApiErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
  title?: string;
}

export function ApiErrorDisplay({ error, onRetry, title = 'Erro ao carregar dados' }: ApiErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 my-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-destructive mb-1">
            {title}
          </h3>
          <p className="text-sm text-destructive/80 mb-3">
            {error.error}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
              API: {error.apiName}
            </span>
            {error.status && (
              <span className="inline-flex items-center text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                Status: {error.status} {error.statusText}
              </span>
            )}
            <span className="inline-flex items-center text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
              {new Date(error.timestamp).toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-sm text-destructive/70 hover:text-destructive mb-3"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetails ? 'Ocultar detalhes' : 'Ver detalhes técnicos'}
          </button>

          {showDetails && (
            <div className="bg-destructive/5 rounded-lg p-4 mb-4 overflow-x-auto">
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-destructive/60">URL:</span>
                  <span className="text-destructive ml-2 break-all">{error.url}</span>
                </div>
                {error.details && (
                  <div>
                    <span className="text-destructive/60">Detalhes:</span>
                    <pre className="text-destructive mt-1 whitespace-pre-wrap break-all">{error.details}</pre>
                  </div>
                )}
                {error.rawResponse && (
                  <div>
                    <span className="text-destructive/60">Resposta raw:</span>
                    <pre className="text-destructive mt-1 whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                      {error.rawResponse}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for inline display
export function ApiErrorBadge({ error }: { error: ApiError }) {
  return (
    <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive text-sm px-3 py-1.5 rounded-lg">
      <AlertTriangle className="w-4 h-4" />
      <span>Erro: {error.apiName}</span>
    </div>
  );
}
