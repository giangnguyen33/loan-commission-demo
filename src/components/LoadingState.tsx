import './LoadingState.css';

interface LoadingStateProps {
  message: string;
}

export const LoadingState = ({ message }: LoadingStateProps) => (
  <p className="loading-state" role="status" aria-live="polite">
    <span className="loading-indicator" aria-hidden="true" />
    <span>{message}</span>
  </p>
);
