import * as React from "react";

interface IResCellProps {
    data ? : any       
}

class ResourceCell extends React.PureComponent<IResCellProps> {
  render() {
    const {
      data: {
        color,
        text,
        data: { avatar, email, languages },
      },
    } = this.props;
    return (
      <div className="dx-template-wrapper">
        <div className="name" style={{ background: color }}>
          <h2>{text}</h2>
        </div>

        <a href="#" className="avatar">
          <img height="155" width="155" src={avatar} alt="Abi Avatar"></img>
        </a>
        <br />
        <br />
        <br />
        <div className="info" style={{ color }}>
          {email}
          <br />
          <b>{languages}</b>
        </div>
      </div>
    );
  }
}

export default ResourceCell;




