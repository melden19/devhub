import moment, { MomentInput } from 'moment'
import { PureComponent, ReactNode } from 'react'

export interface IntervalRefreshProps {
  children: () => ReactNode
  date?: MomentInput
  interval?: number
}

export interface IntervalRefreshState {
  currentInterval: number
  updatedTimes: number
}

const defaultInterval = 1000

export class IntervalRefresh extends PureComponent<
  IntervalRefreshProps,
  IntervalRefreshState
> {
  static defaultProps = {
    interval: defaultInterval,
  }

  intervalInstance?: number

  state: IntervalRefreshState = {
    currentInterval: 1000,
    updatedTimes: 0,
  }

  componentDidMount() {
    this.start(this.props)
  }

  componentDidUpdate(prevProps: IntervalRefreshProps) {
    const interval = this.getIntervalValue(prevProps)

    if (interval !== this.state.currentInterval) {
      this.start(this.props)
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  getIntervalValue({ date, interval: _interval }: IntervalRefreshProps) {
    let interval = _interval || defaultInterval

    if (date) {
      const secondsDiff = moment().diff(date, 's')

      // if (secondsDiff >= 3600) {
      //   // each hour
      //   interval = 3600000
      // } else
      if (secondsDiff >= 60) {
        // each minute
        interval = 60000
      } else {
        // each second
        interval = 1000
      }
    }

    return interval
  }

  start = (props: IntervalRefreshProps) => {
    this.stop()

    const interval = this.getIntervalValue(props)
    if (!(interval > 100)) {
      console.error(
        `Invalid interval: ${interval}. Expected a number bigger than 100ms.`,
        { props: this.props },
      )
    }

    this.setState({ currentInterval: interval }, () => {
      this.intervalInstance = setInterval(
        this.tickAndUpdateIntervalIfNecessary,
        this.state.currentInterval,
      )
    })
  }

  stop = () => {
    if (this.intervalInstance) {
      clearInterval(this.intervalInstance)
      this.intervalInstance = undefined
    }
  }

  tick = (callback: () => void) => {
    if (!this.intervalInstance) return

    this.setState(
      ({ updatedTimes }) => ({
        updatedTimes: updatedTimes + 1,
      }),
      () => {
        if (callback) callback()
      },
    )
  }

  tickAndUpdateIntervalIfNecessary = () =>
    this.tick(this.updateIntervalIfNecessary)

  updateIntervalIfNecessary = () => {
    // interval only change dynamically when date prop is passed
    if (!this.props.date) return

    const newInterval = this.getIntervalValue(this.props)
    if (newInterval === this.state.currentInterval) return

    this.start(this.props)
  }

  render() {
    const { children } = this.props
    return children()
  }
}