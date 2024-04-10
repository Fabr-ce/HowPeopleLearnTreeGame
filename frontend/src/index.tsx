import { createRoot } from "react-dom/client"

// Local imports
import App from "./App"

const container = document.getElementById("root")
const root = createRoot(container!)
root.render(<App />)
