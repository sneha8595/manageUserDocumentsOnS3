import React from "react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import { FaSearch, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Button } from 'reactstrap';

class DateRangePickerComp extends React.Component {
  state = {
    isOpen: false
  }
  onToggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  render() {
    const selectionvalue = `${this.props.dateRange.start.format("MMMM D, YYYY")} - ${this.props.dateRange.end.format("MMMM D, YYYY")}`
    return (
      <div className="form-group row d-flex justify-content-center">
        <label className="col-sm-2 col-form-label">Date Range</label>
        <div className="col-sm-6 col-md-4">
          <div className="input-group add-on">
            <input className="form-control"
              value={selectionvalue} readOnly
            />
            <div className="input-group-btn">
              <Button outline color="info" onClick={this.onToggle}>
                {!this.state.isOpen && <FaCaretDown />}{this.state.isOpen && <FaCaretUp />}
              </Button>
            </div>
            {this.state.isOpen && (
              <DateRangePicker
                value={this.props.dateRange}
                onSelect={this.props.onSelect}
                singleDateRange={true}
              />
            )}
          </div>
        </div>
        <Button color="info" className="col-sm-1 btn-fit" onClick={() => this.props.handleSearch('dateRange')}><FaSearch /></Button>
      </div>
    );
  }

}

export default DateRangePickerComp;
