import React, { Component } from 'react';
import { Button, ButtonGroup, Form, Collapse } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaSearch, FaUpload } from 'react-icons/fa';
import { Link } from "react-router-dom";
import "../App.css";
import { getFileUrls } from '../Services/aws-services';
import FilesList from './FilesList';
import DateRangePickerComp from './DateRangePickerComp';
import originalMoment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(originalMoment);

/*
Allows all the mimetypes, unlimited filesize
*/
class SearchDoc extends Component {
  constructor(props) {
    //window.addEventListener('storage', setAWSConfig);
    super(props);
    const today = moment();
    this.state = {
      name: '',
      description: '',
      fetchedFiles: [],
      dateRange: moment.range(today.clone().subtract(2, "days"), today.clone()),
      ASToggle: false
    }    
  }   
  onSelectDP = (dateRange, states) => {
    this.setState({ dateRange, states });
  };
  handleSearch = async (key) => {
    this.setState({ fetchedFiles: [] });
    if (key !== "dateRange") {
      if (this.state[key] === '' || this.state[key].trim() === '') {
        toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty!`)
        return;
      }
    }
    try {
      const files = await getFileUrls(key, this.state[key]);
      this.setState({ fetchedFiles: files });
      if (files.length > 0) {
        toast.success('Fetching success')
      } else {
        toast.error('Sorry! No Documents found')
      }
    } catch (err) {
      toast.error('Fetching failure' + JSON.stringify(err, 2))
    }
  }

  AStoggleHandler = () => this.setState({ ASToggle: !this.state.ASToggle });

  render() {
    return (
      <div>
        <div className="container">
          <div className="d-flex justify-content-center name-search form-group row">
            <div className="col-offset-md-2 col-sm-10 col-md-10">
              <div className="input-group add-on">
                <input type="text" className="form-control" id="name" placeholder="Search By Name" onChange={(e) => this.setState({ name: e.target.value })} />

                <div className="input-group-btn">
                  <ButtonGroup>
                    <Button onClick={() => this.handleSearch('name')}>
                      <FaSearch />&nbsp;Search
                    </Button>
                    <Link to="/upload">
                      <Button>
                        <FaUpload />&nbsp;Upload
                      </Button>
                    </Link>
                  </ButtonGroup>
                </div>
              </div>
            </div></div>

          <div className="d-flex justify-content-center advanced-search">
            <Button onClick={this.AStoggleHandler}>Advanced Search</Button>
          </div>
          <Collapse isOpen={this.state.ASToggle}>
            <Form className="searchFileForm">
              <div className="form-group row d-flex justify-content-center">
                <label className="col-sm-2 col-form-label">Description</label>
                <div className="col-sm-6 col-md-4">
                  <input type="description" className="form-control" id="description" placeholder="Description" onChange={(e) => this.setState({ description: e.target.value })} />
                </div>
                <Button className="col-sm-1 btn-fit" onClick={() => this.handleSearch('description')}><FaSearch /></Button>
              </div>
              <DateRangePickerComp {...this.state} onSelect={(dateRange) => this.setState({ dateRange })} handleSearch={() => this.handleSearch('dateRange')} />
            </Form>

          </Collapse>
          {this.state.fetchedFiles.length>0 && <FilesList fetchedFiles={this.state.fetchedFiles} />}
          <ToastContainer />
        </div>
      </div>
    );
  }

}

export default SearchDoc;
