import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Authentication error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          maxWidth: '600px',
          margin: '50px auto',
          textAlign: 'center',
          backgroundColor: '#fdf2f2',
          border: '2px solid #f56565',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#c53030', marginBottom: '15px' }}>
            Authentication Error
          </h2>
          <p style={{ color: '#742a2a', marginBottom: '20px' }}>
            Something went wrong with the authentication process.
          </p>
          {this.state.error && (
            <details style={{ textAlign: 'left', marginBottom: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details
              </summary>
              <pre style={{
                backgroundColor: '#ffffff',
                padding: '10px',
                borderRadius: '4px',
                marginTop: '10px',
                fontSize: '12px',
                overflow: 'auto',
                color: '#c53030'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
