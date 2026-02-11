import { Grid } from "@/features/table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-cyan-200 to-sky-200 p-2">
      <Grid />
      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
}

export default App;
