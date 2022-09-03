import EventIcon from '@mui/icons-material/Event';
const EventCards = () => {

    return (
        <div class="card" style={{width:'25%',marginLeft:'2%'}}>
            <h5 class="card-header"><EventIcon/></h5>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    );

}

export default EventCards;
