import React, { useContext } from "react"
import { observer } from "mobx-react-lite"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import Paper from "@material-ui/core/Paper"
import EditIcon from "@material-ui/icons/Edit"
import CheckIcon from "@material-ui/icons/Check"
import IconButton from "@material-ui/core/IconButton"
import MaterialTable from "material-table"
import moment from "moment"
import QueueTableDropdown from "./QueueTableDropdown"
import { QueueStoreContext } from "../stores/QueueStore"
import NotesDialog from "./NotesDialog"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
}))

const QueueTable = observer(queueData => {
  const queueStore = useContext(QueueStoreContext)
  const classes = useStyles()

  const [visibleDialog, setVisibleDialog] = React.useState(false)
  const toggleVisibleDialog = () => {
    setVisibleDialog(!visibleDialog)
  }

  const statusOptions = [
    { value: "ARRIVED", name: "Arrived" },
    { value: "SEEN", name: "Seen" },
    { value: "STEPPED_OUT", name: "Stepped Out" },
    { value: "CAME_BACK", name: "Came Back" },
    { value: "LEFT", name: "Left" },
  ]
  const urgencyOptions = [
    { value: 1, name: 1 },
    { value: 2, name: 2 },
    { value: 3, name: 3 },
    { value: 4, name: 4 },
    { value: 5, name: 5 },
  ]

  const NotesButton = () => {
    return (
      <IconButton onClick={toggleVisibleDialog}>
        <EditIcon />
      </IconButton>
    )
  }

  const SeenButton = () => {
    return (
      <IconButton>
        <CheckIcon />
      </IconButton>
    )
  }
  return (
    <Paper className={classes.root}>
      <MaterialTable
        title={queueStore.queueStats[queueData["queueData"]].name}
        className={classes.table}
        options={{
          search: false,
        }}
        data={queueStore.queues[queueData["queueData"]].map(x => ({
          urgency: x.urgency,
          last: x.participant.last_name,
          uid: x.participant.pp_id,
          timeElapsed: moment(x.status.created_at).format("LT"),
          status: x.status.event_type,
          service: x.service.name,
          seen: false,
          notes: false,
        }))}
        columns={[
          {
            title: "Urgency",
            //eslint-disable-next-line
            render: ({ id, urgency }) => (
              <QueueTableDropdown
                id={id}
                initialValue={urgency}
                items={urgencyOptions}
              />
            ),
          },
          { title: "Last", field: "last" },
          { title: "UID", field: "uid" },
          { title: "Time", field: "timeElapsed" },
          {
            title: "Status",
            //eslint-disable-next-line
            render: ({ id, status }) => (
              <QueueTableDropdown
                id={id}
                initialValue={status}
                items={statusOptions}
              />
            ),
          },
          { title: "Service", field: "service" },
          {
            title: "Seen",
            //eslint-disable-next-line
            render: ({ id }) => <SeenButton id={id} />,
          },
          {
            title: "Notes",
            //eslint-disable-next-line
            render: ({ id }) => <NotesButton id={id} />,
          },
        ]}
      />
      <NotesDialog
        visibleDialog={visibleDialog}
        toggleVisibleDialog={toggleVisibleDialog}
      />
    </Paper>
  )
})

QueueTable.propTypes = {
  queueData: PropTypes.number,
}

export default QueueTable
