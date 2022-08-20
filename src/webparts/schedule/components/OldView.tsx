import * as React from "react";
import "devextreme/dist/css/dx.light.css";

import Scheduler, { Resource } from "devextreme-react/scheduler";
import ContextMenu from "devextreme-react/context-menu";
import Tooltip from "devextreme-react/tooltip";
import { data, employees, shiftTypeData } from "./Data";
import DataCell from "./DataCell";
import ResourceCellTimeLine from "./ResourceCellTimeLine";

import ResourceCell from "./ResourceCell";
//import './Schedule.module.scss';

import { ShiftMenuTemplate } from "./ShiftMenuTemplate";

const appointmentClassName = ".dx-scheduler-appointment";
const cellClassName = ".dx-scheduler-date-table-cell";


const views: any = [
  { type: "timelineMonth", name: "Full" },
  { type: "month", name: "Individual" },
];

const groups:any = ["employeeID"];

interface IoldViewProps{
    scheduler?:any,
    toolTip? :any;
}

interface IoldViewState {
  newAppointment: any;
  tooltipNumDay: number;
  
  contextMenuItems: any;
  target: any;
  disabled: boolean;
  resCell: any;
}

 

class OldView extends React.Component<IoldViewProps, IoldViewState> {
  constructor(props: IoldViewProps) {
    super(props);
    props.scheduler = React.createRef();
    props.toolTip = React.createRef();
    this.state = {
      newAppointment: {
        text: "14-22",
        employeeID: 0,
        resID: 0,
        allDay: true,
        startDate: new Date(),
        endDate: new Date(),
      },
      tooltipNumDay: 5,
    
      contextMenuItems: [],
      target: appointmentClassName,
      disabled: true,
      resCell: ResourceCellTimeLine,
    };
    this.onAppointmentContextMenu = this.onAppointmentContextMenu.bind(this);
    this.onContextMenuItemClick = this.onContextMenuItemClick.bind(this);
    this.onCellContextMenu = this.onCellContextMenu.bind(this);
    this.onContentReady = this.onContentReady.bind(this);
  }

  componentDidMount() {
    
    const element = document.getElementsByClassName(
      "dx-scheduler-header-panel-empty-cell"
    );
    //element[0].appendChild();
  }

  render(): any {
    const { contextMenuItems, target, disabled, resCell } = this.state;
    return (
      <div>
        <Scheduler
          ref={this.props.scheduler}
          timeZone="America/Los_Angeles"
          dataSource={data}
          views={views}
          groups={groups}
          showAllDayPanel={true}
          defaultCurrentView="timelineMonth"
          dataCellComponent={DataCell}
          resourceCellComponent={resCell}
          height={"auto"}
          cellDuration={60}
          firstDayOfWeek={0}
          crossScrollingEnabled={true}
          onAppointmentContextMenu={this.onAppointmentContextMenu}
          onCellContextMenu={this.onCellContextMenu}
          onOptionChanged={this.handlePropertyChange}
          onAppointmentClick={this.onAppointmentClick}
          onCellClick={this.onCellClick}
          onContentReady={this.onContentReady}
        >
          <Resource
            label="employee"
            fieldExpr="employeeID"
            dataSource={employees}
            allowMultiple={false}
          />
          <Resource
            label="shiftTypeData"
            fieldExpr="resID"
            dataSource={shiftTypeData}
            allowMultiple={false}
            useColorAsDefault={true}
          />
        </Scheduler>

        <Tooltip
          ref={this.props.toolTip}
          position="top"
          closeOnOutsideClick={true}
        >
          <div>
            <button
              onClick={this.handleCreateBtnClick}
              className="dx-Abitooptip-button"
            >
              Create
            </button>{" "}
            Shift{" "}
            <input
              onChange={this.handleShiftInput}
              defaultValue="14-22"
              className="dx-Abitooptip-input"
            />{" "}
            For{" "}
            <input
              onChange={this.handleDayNumInput}
              defaultValue={5}
              type="number"
              className="dx-Abitooptip-inputNum"
            />{" "}
            Days
          </div>
        </Tooltip>
        <ContextMenu
          dataSource={contextMenuItems}
          width={200}
          target={target}
          disabled={disabled}
          onItemClick={this.onContextMenuItemClick}
          itemRender={ShiftMenuTemplate}
        />
      </div>
    );
  }

  onContentReady(e: any) {
    //e.component.scrollTo(new Date());
  }

  onAppointmentClick = (e: any) => {
    e.cancel = true;
    e.component.showAppointmentPopup(e.appointmentData);
  };

  onCellClick = (e: any) => {
    this.props.toolTip.current.instance.show(e.cellElement);

    const startDate = new Date(e.cellData.startDate);
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(e.cellData.startDate);
    endDate.setDate(endDate.getDate() + this.state.tooltipNumDay);

    this.setState((prevState) => ({
      ...prevState,
      newAppointment: {
        ...prevState.newAppointment,
        employeeID: e.cellData.groups.employeeID,
        startDate: startDate,
        endDate: endDate,
      },
    }));
  };

  // tooltip create button
  handleCreateBtnClick = (e: any) => {
    this.props.scheduler.current.instance.addAppointment(
      this.state.newAppointment
    );
    this.props.toolTip.current.instance.hide();
  };
  // tooltip create shift inoput
  handleShiftInput = (e: any) => {
    this.setState((prevState) => ({
      ...prevState,
      newAppointment: {
        ...prevState.newAppointment,
        text: e.target.value,
      },
    }));
  };

  // hundle days number to be added tooltip
  handleDayNumInput =  (e: any) => {
    e.persist();
    const endNumDate = new Date(this.state.newAppointment.startDate);

    endNumDate.setDate(endNumDate.getDate() + parseInt(e.target.value));

   
      this.setState((prevState) => ({
        ...prevState,
        tooltipNumDay: parseInt(e.target.value),
        newAppointment: {
          ...prevState.newAppointment,
          endDate: endNumDate,
        },
      }));
      console.log(endNumDate);
      console.log(e);
  };
  //hundling change of the schedule
  handlePropertyChange = (e: any) => {
    //// here we change the resource style depends on the view showen
    if (e.name === "currentView") {
      e.value === "Individual"
        ? this.setState({ resCell: ResourceCell })
        : this.setState({ resCell: ResourceCellTimeLine });
    }

    ///////////////

    if (e.name === "selectedCellData") {
    }
  };
  //////////
  // context menu

  onAppointmentContextMenu({ appointmentData, targetedAppointmentData }: any) {
    const scheduler = this.props.scheduler.current.instance;
    const resourceItems = shiftTypeData.map((item) => ({
      ...item,
      onItemClick: ({ itemData }: any) =>
        scheduler.updateAppointment(appointmentData, {
          ...appointmentData,
          ...{ resID: [itemData.id] },
        }),
    }));
    this.setState((state) => ({
      ...state,
      target: appointmentClassName,
      disabled: false,
      contextMenuItems: [
        {
          text: "Edit",
          onItemClick: () => scheduler.showAppointmentPopup(appointmentData),
        },
        {
          text: "Delete",
          onItemClick: () => scheduler.deleteAppointment(appointmentData),
        },

        { text: "Mark as", beginGroup: true, disabled: true },
        ...resourceItems,
      ],
    }));
  }

  onContextMenuItemClick(e: any) {
    e.itemData.onItemClick(e);
  }

  onCellContextMenu({ cellData }: any) {
    const scheduler = this.props.scheduler.current.instance;
    this.setState((state) => ({
      ...state,
      target: cellClassName,
      disabled: false,
      contextMenuItems: [
        {
          text: "New Appointment",
          onItemClick: () =>
            scheduler.showAppointmentPopup(
              { startDate: cellData.startDate },
              true
            ),
        },
      ],
    }));
  }
}

export default OldView;