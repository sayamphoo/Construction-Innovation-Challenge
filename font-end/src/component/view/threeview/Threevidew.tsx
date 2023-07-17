import React, { useState, ChangeEvent } from "react";
import "./Threeview.scss";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import logo from "../../../cube.png";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface MyComponentProps {
  path: string;
}


const Threeview: React.FC<MyComponentProps>= (props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { path } = props;

  const Preview: React.FC = () => {
    const { scene } = useGLTF(path);
    return <primitive object={scene} />;
  };

  const Heard = () => {
    if (!selectedFile != null) {
      return (
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{ fov: 45 }}
          style={{ position: "absolute" }}
        >
          <color attach="background" args={[parseInt("0x101010", 16)]} />
          <PresentationControls>
            <Stage environment={"sunset"}>
              <Preview></Preview>
            </Stage>
          </PresentationControls>
        </Canvas>
      );
    } else {
      return <a>sasa</a>;
    }
  };

  // return (
  //   <div>
  //     <h1>อัปโหลดไฟล์และแสดงตัวอย่าง</h1>
  //     <input type="file" onChange={handleFileChange} />
  //     <Heard />
  //   </div>
  // );

  return <Heard></Heard>;
};

export default Threeview;

//URL.createObjectURL(selectedFile!!)

// const InputFile: React.FC = () => {
//   return (
//     <div className="back">
//       <p>Input 3D file FBX</p>
//       <img src={logo} alt="sasa" width={150} />
//       <form action="/action_page.php">
//         <input type="file" id="myfile" name="myfile" />
//         <input type="submit" />
//       </form>
//     </div>
//   );
// };

// function Model() {
//   const { scene } = useGLTF("/drone.glb");
//   return <primitive object={scene} />;
// }

// const CanvarPreview: React.FC = () => {
//   return (

//   );
// };

// return <InputFile />;

//   return (
//     <div>
//       <input type="file" onChange={handleFileInputChange} />
//       <Preview />
//     </div>
//   );
// };

// export default Threeview;
