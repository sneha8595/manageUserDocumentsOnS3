import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { getFileUrls } from '../aws-services';
import FilesList from '../FilesList';
import DateRangePickerComp from './DateRangePickerComp';
import originalMoment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(originalMoment);

/*
Allows all the mimetypes, unlimited filesize
*/
class SearchFile extends Component {
  constructor(props) {
    super(props);
    const today = moment();
    this.state = {
      name: '',
      description: '',
      fetchedFiles: [],
      dateRange: moment.range(today.clone().subtract(2, "days"), today.clone())
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
  render() {
    return (
      <div className="container">
        <h3>Search your Documents by: </h3><br />
        <form className="searchFileForm">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-6 col-md-4">
              <input type="text" className="form-control" id="name" placeholder="Name" onChange={(e) => this.setState({ name: e.target.value })} />
            </div>
            <Button className="col-sm-1 btn-fit" onClick={() => this.handleSearch('name')}><FaSearch /></Button>
          </div>
          <div className="row"><div className="col-md-4 offset-md-4">--------OR---------</div></div><br />
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Description</label>
            <div className="col-sm-6 col-md-4">
              <input type="description" className="form-control" id="description" placeholder="Description" onChange={(e) => this.setState({ description: e.target.value })} />
            </div>
            <Button className="col-sm-1 btn-fit" onClick={() => this.handleSearch('description')}><FaSearch /></Button>
          </div>
          <div className="row"><div className="col-md-4 offset-md-4">--------OR---------</div></div><br />
          <DateRangePickerComp {...this.state} onSelect={(dateRange) => this.setState({ dateRange })} handleSearch={() => this.handleSearch('dateRange')} />
        </form>

        <FilesList fetchedFiles={this.state.fetchedFiles} />
        <ToastContainer />
      </div>
    );
  }

}

export default SearchFile;