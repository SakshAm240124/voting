import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner">
        <div className="spinner-ring ring-saffron"></div>
        <div className="spinner-ring ring-white"></div>
        <div className="spinner-ring ring-green"></div>
      </div>
    </div>
  );
}
