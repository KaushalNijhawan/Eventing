import {Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { forwardRef, useImperativeHandle, useState } from "react";
import "./bookingCancel.css";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'white',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
}

const BookingAlertPopup = forwardRef((props,ref) => {
    const [open , setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        handleOpen() {
          setOpen(true);
        },
        handleClose() {
          setOpen(false);
        }
      }));

      const handleClose = () =>{
          setOpen(false);
      }

      const confirmCancel = ()=>{
        props.cancelBooking();
      }

    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
               <div className="">
                   <h2>Are you sure want to cancel the Booking ?</h2>
               </div>
               <div className="button-tog">
                    <button className="btn btn-primary" onClick={confirmCancel}>Confirm</button>
                    <button className="btn btn-danger" onClick={handleClose}>Cancel</button>
               </div>
            </Box>
        </Modal>
    );
});
export default BookingAlertPopup;