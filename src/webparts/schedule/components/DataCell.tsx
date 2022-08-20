
import * as React from "react";

interface IdataCellProps {
   data : any      
}

function isWeekEnd(date : any) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getCurrentTraining(date : any, employeeID:any) {
  const result = (date + employeeID) % 3;
  const currentTraining = `training-background-${result}`;

  return currentTraining;
}

class DataCell extends React.PureComponent <IdataCellProps> {
  render() {
    const {
      data: {
        startDate,
        groups: { employeeID },
        text,
      },
    } = this.props;
    const dayClasses = [
      "day-cell",
      getCurrentTraining(startDate.getDate(), employeeID),
    ];

    const employeeClasses = [`employee-1`, "dx-template-wrapper"];
    if (isWeekEnd(startDate)) {
      employeeClasses.push(`employee-weekend-1`);
    }

    return (
      <div className={employeeClasses.join(" ")}>
        <div className={dayClasses.join(" ")}>{text}</div>
      </div>
    );
  }
}

export default DataCell;