import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>SakshamVote &copy; {new Date().getFullYear()}</span>
        <span>Secure Digital Voting</span>
      </div>
    </footer>
  );
}
