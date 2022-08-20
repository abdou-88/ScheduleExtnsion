import * as React from 'react';

import { IScheduleProps } from './IScheduleProps';

import OldView from './OldView';

export default class Schedule extends React.Component<IScheduleProps, {}> {
  public render(): React.ReactElement<IScheduleProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <OldView></OldView>
    );
  }
}
