import { AuthenticationStatus } from './components/AuthenticationStatus';
import { OAuthErrorFixer } from './components/OAuthErrorFixer';
import './App.css'

function App() {
  return (
    <div className="App">
      <OAuthErrorFixer />
      <AuthenticationStatus />
    </div>
  );
}

export default App
