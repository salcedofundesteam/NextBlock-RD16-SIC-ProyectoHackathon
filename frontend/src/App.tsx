import AppRouter from './routes/AppRouter';
import { AllDataProvider } from './context/AllDataContext';
import { AgentProvider } from './context/AgentContext';

function App() {
  return (
    <AllDataProvider>
      <AgentProvider>
        <AppRouter />
      </AgentProvider>
    </AllDataProvider>
  );
}

export default App;
