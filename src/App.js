import { useState,useEffect,useRef } from "react";
import '@tensorflow/tfjs-backend-webgl';
const mobilenet = require('@tensorflow-models/mobilenet');

function App() {
  const [isModelLoading,setModelLoading] = useState(false);
  const [model,setModel] = useState(null);
  const [ImageURL,setImage] = useState(null);
  const [result, setResult] = useState([]);
  const imageRef = useRef()

  const loadModel = async () =>{
    setModelLoading(true)
    try {
      const mainModel = await mobilenet.load();
      setModel(mainModel)
      setModelLoading(false)
    } catch (error) {
      console.log(error)
      setModelLoading(false)
    }
  }

  const identify = async () => {
    console.log(model)
    const result = await model.classify(imageRef.current)
    console.log(result)
    setResult(result)
  }

  const uplaodImage = (e) => {
    const {files} = e.target
    if(files.length > 0)
    {
      const url = URL.createObjectURL(files[0])
      setImage(url)
    }else{
      setImage(null)
    }
  }

  useEffect(()=>{
    loadModel()
  },[])

  if(isModelLoading){
    return <h2>Model Loading........</h2>
  }

  return (
    <div className="App">
      <div className="header"><h1>Image Detection</h1></div>
      <div className="inputContiner">
        <input type="file" accept="image/*" capture="camera" className="inputImage" onChange={uplaodImage}/>
      </div>

      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
            {ImageURL && <img className="previewImage" src={ImageURL} alt="Preview" crossOrigin="anonymous" ref={imageRef}/>}
          </div>
        </div>
      </div>
      {ImageURL && <button className="mainButton" onClick={identify}>Identify Button</button>}
      {result.length > 0 && <div className="result">
        {
          result.map((results,index)=>{
            return(
              <div className="results" key={results.className}>
                <span>{results.className}</span><br/>
                <span>{(results.probability * 100).toFixed(2)} %</span>
              </div>
            )
          })
        }
        </div>}
    </div>
  );
}

export default App;
