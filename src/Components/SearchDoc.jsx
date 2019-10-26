import React, { Component } from 'react';
import { Button, ButtonGroup, Form, Collapse } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaSearch, FaUpload } from 'react-icons/fa';
import { Link } from "react-router-dom";
import "../App.css";
import { getFileUrls } from '../Services/aws-services';
import FilesList from './FilesList';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import DateRangePickerComp from './DateRangePickerComp';
import originalMoment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(originalMoment);

/*
Allows all the mimetypes, unlimited filesize
*/
class SearchDoc extends Component {
  constructor(props) {
    super(props);
    const today = moment();
    this.state = {
      name: '',
      tags: [],
      fetchedFiles: [],
      dateRange: moment.range(today.clone().subtract(2, "days"), today.clone()),
      ASToggle: false
    }
    this.handleTagChange = this.handleTagChange.bind(this);
  }
  handleTagChange(tags) {
    this.setState({ tags })
  }
  onSelectDP = (dateRange, states) => {
    this.setState({ dateRange, states });
  };
  handleSearch = async (key) => {
    this.setState({ fetchedFiles: [] });
    if (key === "name") {
      if (this.state[key] === '' || this.state[key].trim() === '') {
        toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty!`)
        return;
      }
    } else if (key === "tags") {
      if (this.state[key].length == 0) {
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

  handleNameEnter=(event)=>{
    const code = event.keyCode || event.which;
    if(code === 13) { //13 is the enter keycode
      this.handleSearch('name')
    } 
  }

  // componentDidMount(){
  //   document.getElementsByClassName("react-tagsinput-input")[0].placeholder = "Search by Tags";
  // }

  render() {
    return (
      <div>
        <div className="justify-content-center name-search form-group row">
          <div className="col-md-12 col-sm-8">
            <div className="input-group add-on">
              <input type="text" className="form-control" id="name" placeholder="Search By Name" onChange={(e) => this.setState({ name: e.target.value })} 
              onKeyPress={this.handleNameEnter.bind(this)}/>

              <div className="input-group-btn">
                <ButtonGroup>
                  <Button color="info" onClick={() => this.handleSearch('name')}>
                    <FaSearch /><span className="d-none d-md-inline">&nbsp;Search</span>
                  </Button>
                  <Link to="/upload">
                    <Button color="info">
                      <FaUpload /><span className="d-none d-md-inline">&nbsp;Upload</span>
                    </Button>
                  </Link>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <a href="#" className="advanced-search-link" onClick={this.AStoggleHandler}>Advanced Search</a>
        </div>
        <Collapse isOpen={this.state.ASToggle}>
          <Form className="searchFileForm">
            <div className="form-group row d-flex justify-content-center advanced-search">
              <label className="col-sm-2 col-form-label">Tag</label>
              <div className="col-sm-6 col-md-4">
                <TagsInput value={this.state.tags} onChange={this.handleTagChange} />
              </div>
              <Button color="info" className="col-sm-1 btn-fit" onClick={() => this.handleSearch('tags')}><FaSearch /></Button>
            </div>
            <DateRangePickerComp {...this.state} onSelect={(dateRange) => this.setState({ dateRange })} handleSearch={() => this.handleSearch('dateRange')} />
          </Form>

        </Collapse>
        {this.state.fetchedFiles.length > 0 && <FilesList fetchedFiles={this.state.fetchedFiles} />}
        <ToastContainer />
      </div>
    );
  }

}

export default SearchDoc;
