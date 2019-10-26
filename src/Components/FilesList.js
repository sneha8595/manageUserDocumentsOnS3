import React from 'react';
import { Table, Button } from 'reactstrap';
import { FaEye } from 'react-icons/fa';

const FilesList = ({ fetchedFiles }) => {
    return (
        <div>
            <h5>Documents</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>

                    {fetchedFiles.length > 0 && fetchedFiles.map((fileDetails, key) => (
                        <tr key={key}>
                            <td>{fileDetails.name}</td>
                            <td> <a href={fileDetails.fileUrl} target="_blank" rel="noopener noreferrer"><Button><FaEye /></Button></a></td>
                        </tr>
                    ))
                    }
                    {fetchedFiles.length === 0 &&
                        <tr>
                            <td colSpan="2">No results</td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default FilesList;