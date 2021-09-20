import React from "react";
import { TextField, Card, Button, Autocomplete, Grid } from "@mui/material";
import Modal from "react-modal";
import axios from "axios";

class Challenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleModal: false,
    };
  }
  componentDidMount() {
    axios
      .get("http://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        console.log("axios call", response.data);
        this.setState((prevState) => {
          return {
            ...prevState,
            jsonData: response.data,
            titleList: response.data.map((obj) => obj.title),
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onSearchType = (e) => {
    let target = e.target.value;
    let searchArr = [];
    for (let i = 0; i < this.state.jsonData.length; i++) {
      const jsonObj = this.state.jsonData[i];
      if (jsonObj.title.includes(target)) {
        searchArr.push(jsonObj);
      }
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        mappedTitles: searchArr.map(this.displaySearchItem),
      };
    });
  };
  displaySearchItem = (item) => {
    return (
      <Grid item xs={3}>
        <Card
          color="secondary"
          style={{
            margin: "5px",
            float: "left",
            backgroundColor: "darkmagenta",
            color: "white",
            width: "100%",
          }}
          name={item.body}
          id={item.userId}
          key={item.id}
        >
          <h5 style={{ padding: "10px" }}>{item.title}</h5>
          <Button
            type="button"
            onClick={this.editClick}
            lang={item.userId}
            name={item.body}
            id={item.id}
            value={item.title}
          >
            Edit
          </Button>
        </Card>
      </Grid>
    );
  };
  editClick = (e) => {
    let currItem = e.currentTarget;
    console.log("current id", currItem.id);
    this.setState((prevState) => {
      return {
        ...prevState,
        id: currItem.id,
        userId: currItem.lang,
        title: currItem.value,
        body: currItem.name,
      };
    }, this.modalToggler);
  };
  handleChange = (e) => {
    let target = e.target;
    let name = target.name;
    let val = target.value;
    this.setState((prevState) => {
      for (let i = 0; i < this.state.jsonData.length; i++) {
        const jsonObj = this.state.jsonData[i];
        if (this.state.id === jsonObj.id) {
          return {
            ...prevState,
            [name]: val,
          };
        }
      }
    });
  };
  populateForm = (e) => {
    let currTitle = e.currentTarget.textContent;
    for (let i = 0; i < this.state.jsonData.length; i++) {
      const jsonObj = this.state.jsonData[i];
      if (jsonObj.title.includes(currTitle)) {
        this.setState((prevState) => {
          return {
            ...prevState,
            id: jsonObj.id,
            userId: jsonObj.userId,
            title: jsonObj.title,
            body: jsonObj.body,
          };
        });
      }
    }
  };
  handleSubmit = () => {
    for (let i = 0; i < this.state.jsonData.length; i++) {
      const jsonObj = this.state.jsonData[i];
      if (this.state.id === jsonObj.id) {
        this.setState((prevState) => {
          const newObj = {
            title: prevState.title,
            body: prevState.body,
            id: prevState.id,
            userId: prevState.userId,
          };
          prevState.jsonData.splice(i, 1, newObj);
          const newJsonData = prevState.jsonData;
          return {
            ...prevState,
            jsonData: newJsonData,
          };
        });
      }
    }
    this.modalToggler();
  };
  reducer = (state = 4) => {
    return state;
  };
  modalToggler = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        toggleModal: !prevState.toggleModal,
      };
    });
  };
  render() {
    return (
      <React.Fragment>
          <div style={{backgroundColor: "pink"}}>
        {this.state.toggleModal ? (
          <Modal isOpen={this.state.toggleModal} toggle={this.modalToggler}>
            <div>
              <form>
                <Autocomplete
                  options={this.state.titleList}
                  defaultValue={this.state.title}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Title"
                      name="title"
                      style={{ width: "100%", margin: "7px" }}
                      multiline
                    />
                  )}
                  autoComplete={true}
                  onChange={this.populateForm}
                />
                <TextField
                  style={{ width: "100%", margin: "7px" }}
                  label="Current Body"
                  disabled
                  value={this.state.body}
                  multiline
                ></TextField>
                <TextField
                  name="userId"
                  label="User Id"
                  onChange={this.handleChange}
                  value={this.state.userId}
                  disabled
                  style={{ width: "100%", margin: "7px" }}
                ></TextField>
                <TextField
                  name="id"
                  label="Id"
                  onChange={this.handleChange}
                  value={this.state.id}
                  disabled
                  style={{ width: "100%", margin: "7px" }}
                ></TextField>
                <TextField
                  name="title"
                  style={{ width: "100%", margin: "7px" }}
                  label="New title"
                  onChange={this.handleChange}
                  multiline
                ></TextField>
                <TextField
                  name="body"
                  style={{ width: "100%", margin: "7px" }}
                  label="New Body"
                  onChange={this.handleChange}
                  multiline
                ></TextField>
              </form>
            </div>
            <Button color="primary" onClick={this.handleSubmit}>
              Submit Changes
            </Button>
            <Button
              color="secondary"
              onClick={this.modalToggler}
              style={{ float: "right" }}
            >
              Return to Search
            </Button>
          </Modal>
        ) : (
          ""
        )}
        <form noValidate>
          <TextField
            label="Search By Title"
            type="text"
            name="searchTitle"
            onChange={this.onSearchType}
            style={{
                margin: "25px",
            }}
          />
        </form>
        <Grid container rowSpacing={1} spacing={2}>
          {this.state.mappedTitles}
        </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default Challenge;
