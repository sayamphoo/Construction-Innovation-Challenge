import "./HomeView.scss";
import React, { useState, useEffect } from "react";
import Threeview from "../threeview/Threevidew";
import Swal from "sweetalert2";

interface File {
  file: number;
}

const HomeView: React.FC = () => {
  const [data, setData] = useState<File[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://34.201.53.199:7700/file-all");
      const data = await response.json();
      if(data != null){
        setData(data);
      }
      
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [path, setPath] = useState<string>("");

  function setPathfile(path: any) {
    setPath(`http://34.201.53.199:7700/image/${path}`);
  }

  const Card = data.map((datas: File) => {
    return (
      <div onClick={() => setPathfile(datas.file)} className="card">
        <img src={"3d-modeling.png"} />
        <p>{datas.file}</p>
      </div>
    );
  });

  const [upload, setUpload] = useState<boolean>(false);

  function setUploadOpen(): void {
    setUpload(!upload);
  }

  const Upload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    function handleFileChange(e: any) {
      setSelectedFile(e.target.files[0]);
    }

    const handleUpload = () => {
      // Perform the upload logic here
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        fetch("http://34.201.53.199:7700/upload-point-cloud", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            Swal.fire(
              'Good job!',
              'You clicked the button!',
              'success'
            )
            setUploadOpen();
            fetchData();
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            })

            setUploadOpen()
          });

          Swal.fire({
            title: 'uploading...!',
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })

      } else {
        console.log("No file selected");
      }
    };

    return (
      <div
        style={!upload ? { display: "none" } : { display: "hidden" }}
        className="upload"
      >
        <p>Input 3D file GLB</p>
        <img src={"cube.png"} alt="sasa" width={150} />
        <div className="form-s">
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
          <button onClick={handleUpload}>Upload</button>
        </div>
      </div>
    );
  };

  const Widght: React.FC = () => {
    if (path?.length == 0) {
      return (
        <div>
          <Upload></Upload>
          <div className="home-view">
            {Card}
            <div onClick={() => setUploadOpen()} className="card-new">
              <img src={"3d-modeling-draw.png"} />
              <p>UPLOAD</p>
            </div>
          </div>
        </div>
      );
    } else {
      return <Threeview path={path}></Threeview>;
    }
  };

  return <Widght></Widght>;
};

export default HomeView;
