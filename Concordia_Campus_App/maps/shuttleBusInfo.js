const shuttleStops = [
    {
        keyID:1,
        latitude:45.497163,
        longitude:-73.578535,
        title:'SGW Shuttle Bus Stop',
        from: 'SGW Campus',
        to: 'Loyola Campus',
        departureTimes: {
            monday_to_thursday: 
                ['9:30 AM', '09:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', 
                    '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM',
                    '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '4:00 PM', '4:15 PM', '4:45 PM', '5:00 PM', '5:15 PM', '5:30 PM',
                    '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM'],
            friday: ['09:45 AM', '10:00 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:30 AM', 
                    '12:15 PM', '12:30 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:00 PM', '2:15 PM',
                    '2:45 PM', '3:00 PM', '3:15 PM', '3:45 PM', '4:00 PM', '4:45 PM', '5:15 PM', '5:45 PM', '6:15 PM'],
        }
    },
    {
        keyID:2,
        latitude:45.458424,
        longitude:-73.638369,
        title:'Loyola Shuttle Bus Stop',
        from: 'Loyola Campus',
        to: 'SGW Campus',
        departureTimes: {
            monday_to_thursday: 
                ['9:15 AM','9:30 AM', '09:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', 
                    '11:45 AM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM',
                    '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:30 PM', '4:45 PM', '5:00 PM', '5:15 PM', '5:30 PM',
                    '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM'],
            friday: ['09:15 AM', '09:30 AM', '09:45 AM', '10:15 AM', '10:45 AM', '11:00 AM', '11:15 AM', 
                    '12:00 PM', '12:15 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:45 PM', '2:15 PM',
                    '2:30 PM', '2:45 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:45 PM', '5:15 PM', '5:45 PM', '6:15 PM'],
        }
    }
];

export default shuttleStops;