import React from "react";

class Thumb extends React.Component {
  state = {
    loading: false,
    thumb: undefined
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.thumb !== nextState.thumb;
  }

  componentWillUnmount() {
    this.setState({ loading: false, thumb: undefined });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) {
      return;
    }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.file);
    });
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) {
      return null;
    }

    if (loading) {
      return <p>loading...</p>;
    }

    return (
        <img
          style={{padding: '8px'}}
          src={thumb}
          alt={file.name}
          width={'20%'}
        />
    );
  }
}

export default Thumb;
