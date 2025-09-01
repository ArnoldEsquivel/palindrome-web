import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * Props for ErrorState component
 */
export interface ErrorStateProps {
  /** Error message to display */
  error: string;
  /** Custom title override */
  title?: string;
  /** Callback to retry the failed operation */
  onRetry?: () => void;
  /** Callback to clear/reset the error */
  onClear?: () => void;
  /** Whether retry is currently loading */
  isRetrying?: boolean;
  /** Error type for icon selection */
  errorType?: 'network' | 'server' | 'validation' | 'unknown';
  /** Additional CSS classes */
  className?: string;
}

/**
 * ErrorState component for displaying search and API errors
 * 
 * Features:
 * - WCAG 2.1 AA compliant with role="alert"
 * - Different error types with appropriate icons
 * - Retry functionality with loading state
 * - Clear error messaging
 * - Responsive design
 * 
 * @example
 * ```tsx
 * // Basic error
 * <ErrorState error="Network error occurred" />
 * 
 * // With retry functionality
 * <ErrorState 
 *   error="Failed to load products"
 *   onRetry={retrySearch}
 *   isRetrying={isLoading}
 * />
 * ```
 */
export default function ErrorState({
  error,
  title,
  onRetry,
  onClear,
  isRetrying = false,
  errorType = 'unknown',
  className
}: ErrorStateProps) {

  // Get appropriate icon based on error type
  const getErrorIcon = () => {
    const iconProps = { className: "h-6 w-6" };
    
    switch (errorType) {
      case 'network':
        return <Wifi {...iconProps} />;
      case 'server':
        return <Server {...iconProps} />;
      case 'validation':
        return <AlertTriangle {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  // Get default title based on error type
  const getDefaultTitle = () => {
    switch (errorType) {
      case 'network':
        return 'Error de conexión';
      case 'server':
        return 'Error del servidor';
      case 'validation':
        return 'Error de validación';
      default:
        return 'Error inesperado';
    }
  };

  // Get helpful suggestions based on error type
  const getSuggestions = () => {
    switch (errorType) {
      case 'network':
        return [
          'Verifica tu conexión a internet',
          'Intenta refrescar la página',
          'Comprueba que el servidor esté funcionando'
        ];
      case 'server':
        return [
          'El servidor puede estar temporalmente no disponible',
          'Intenta nuevamente en unos momentos',
          'Si el problema persiste, contacta al soporte'
        ];
      case 'validation':
        return [
          'Verifica que tu búsqueda sea válida',
          'Intenta con términos diferentes',
          'Asegúrate de usar caracteres válidos'
        ];
      default:
        return [
          'Intenta refrescar la página',
          'Verifica tu conexión',
          'Si el problema persiste, contacta al soporte'
        ];
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center",
        "py-8 px-6 text-center",
        "min-h-[300px]",
        className
      )}
      data-testid="error-state"
    >
      {/* Alert Component for Accessibility */}
      <Alert 
        variant="destructive" 
        className="mb-6 max-w-md"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-3">
          {getErrorIcon()}
          <div className="flex-1 text-left">
            <h3 className="font-medium mb-1">
              {title || getDefaultTitle()}
            </h3>
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="min-w-[120px]"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reintentando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar
              </>
            )}
          </Button>
        )}
        
        {onClear && (
          <Button 
            variant="outline" 
            onClick={onClear}
            disabled={isRetrying}
            className="min-w-[120px]"
          >
            Limpiar búsqueda
          </Button>
        )}
      </div>

      {/* Helpful Suggestions */}
      <div className="max-w-md">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Qué puedes intentar:
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2 text-left">
          {getSuggestions().map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technical Details (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 w-full max-w-md">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            Detalles técnicos
          </summary>
          <div className="mt-2 p-3 bg-muted rounded text-xs font-mono text-left overflow-auto">
            <p><strong>Error:</strong> {error}</p>
            <p><strong>Type:</strong> {errorType}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </details>
      )}
    </div>
  );
}

/**
 * Compact ErrorState for smaller areas
 */
export function ErrorStateCompact({ 
  error, 
  onRetry, 
  isRetrying = false,
  className 
}: Pick<ErrorStateProps, 'error' | 'onRetry' | 'isRetrying' | 'className'>) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4",
        "bg-destructive/10 border border-destructive/20 rounded-lg",
        className
      )}
      role="alert"
      data-testid="error-state-compact"
    >
      <div className="flex items-center gap-3 flex-1">
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
        <p className="text-sm text-destructive font-medium">
          {error}
        </p>
      </div>
      
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="ml-3 border-destructive/20 hover:bg-destructive/10"
        >
          {isRetrying ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            'Reintentar'
          )}
        </Button>
      )}
    </div>
  );
}
