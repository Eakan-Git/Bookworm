import './App.css'
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('greeting', { defaultValue: 'Hello, World!' })}</h1>
      <p>{t('description', { defaultValue: 'This is a sample application.' })}</p>
    </>
  )
}

export default App
