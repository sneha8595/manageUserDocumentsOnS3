import React, { Component } from 'react';
import { Progress, Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { uploadFileToS3, uploadUserDetailsToDDB } from '../Services/aws-services';
import { FormErrors } from './FormErrors';

class UploadDoc extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState = {
      name: '',
      description: '',
      file: '',
      formErrors: {
        name: '',
        description: '',
        file: '',
      },
      isNamevalid: false,
      isDescriptionValid: false,
      isFileValid: false,
      isFormValid: false,
      uploaded: 0
    }
  }

  handleUserInput = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    let formErrors = this.state.formErrors;
    let { isNamevalid, isDescriptionValid, isFileValid } = this.state;

    switch (name) {
      case 'name':
        isNamevalid = value.length > 0;
        formErrors.name = isNamevalid ? '' : 'Name cannot be empty!';
        break;
      case 'description':
        isDescriptionValid = value.length > 0;
        formErrors.description = isDescriptionValid ? '' : 'Description cannot be empty!';
        break;
      case 'file':
        isFileValid = event.target.files[0] instanceof File;
        value = event.target.files[0];
        formErrors.file = isFileValid ? '' : 'Please upload the file';
        break;
      default:
        break;
    }

    this.setState({ formErrors, isNamevalid, isDescriptionValid, isFileValid, [name]: value }, () => {
      this.validateForm();
    })
  }

  validateForm() {
    this.setState({ isFormValid: this.state.isNamevalid && this.state.isDescriptionValid && this.state.isFileValid });
  }

  errorClass(error) {
    return error.length === 0 ? '' : 'has-error';
  }

  onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      uploadFileToS3(this.state.name, this.state.file)
        .on('httpUploadProgress', ProgressEvent => {
          this.setState({
            uploaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
          })
        }).send(async (err, uploadedFileData) => {
          if (err) { this.handleUploadErrors(err); return; }
          if (!('Key' in uploadedFileData)) { this.handleUploadErrors(err); return; }
          const data = {
            'name': this.state.name,
            'searchName': this.state.name.toLowerCase(),
            'description': this.state.description,
            'searchDescription': this.state.description.toLowerCase(),
            's3FileKey': uploadedFileData.Key
          };
          await uploadUserDetailsToDDB(data)
            .then(res => {
              toast.success('Upload success');
              window.setTimeout(() => {
                if (document.getElementById("fileInput")) { document.getElementById("fileInput").value = ""; }
                this.setState({ ...this.initialState })
              }, 5000);
            })
            .catch(err => {
              this.handleUploadErrors(err);
            });

        });

    } catch (err) {
      this.handleUploadErrors(err);
    }
  }

  handleUploadErrors = (err) => {
    console.log(typeof err == "string" ? err : JSON.stringify(err, 2));
    toast.error('Upload failure')
  }
  render() {
    return (
      <div className="container">
        <h3>Upload Your Documents</h3><br />
        <form>
          <div className={`form-group row ${this.errorClass(this.state.formErrors.name)}`}>
            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-6 col-md-4">
              <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={this.state.name} onChange={this.handleUserInput} />
            </div>
          </div>
          <div className={`form-group row ${this.errorClass(this.state.formErrors.description)}`}>
            <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
            <div className="col-sm-6 col-md-4">
              <textarea type="text" className="form-control" id="description" placeholder="Description" name="description" value={this.state.description} onChange={this.handleUserInput} />
            </div>
          </div>

          <div className={`form-group row ${this.errorClass(this.state.formErrors.file)}`}>
            <label className="col-sm-2 col-form-label">Upload your file</label>
            <div className="col-sm-6 col-md-4">
              <div className="files">
                <input type="file" name="file" onChange={this.handleUserInput} id="fileInput"></input>
              </div>
            </div>
          </div>

          <div className="panel panel-default">
            <FormErrors formErrors={this.state.formErrors} />
          </div>

          <div className="form-group">
            <ToastContainer />
            <Progress max="100" color="success" value={this.state.uploaded}>{Math.round(this.state.uploaded, 2)}%</Progress>

          </div>

          <Button color="success" disabled={!this.state.isFormValid || this.state.uploaded !== 0} onClick={this.onSubmitHandler}>Upload</Button>
        </form>
      </div>
    );
  }

}

export default UploadDoc;
