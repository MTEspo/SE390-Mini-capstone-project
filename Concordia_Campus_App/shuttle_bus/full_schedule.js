import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import shuttleStops from '../maps/shuttleBusInfo.js';
import styles from './styles/full_schedule_styles.js';

const FullShuttleSchedule = () => {
    const sgwStop = shuttleStops.find(stop => stop.title === 'SGW Shuttle Bus Stop');
    const loyolaStop = shuttleStops.find(stop => stop.title === 'Loyola Shuttle Bus Stop');

    const renderScheduleSection = (title, loyolaTimes, sgwTimes) => (
        <View style={styles.scheduleBlock}>
            <Text style={styles.headerText}>{title}</Text>
            <View style={styles.tableHeader}>
                <View style={styles.column}>
                    <Text style={styles.columnHeaderText}>LOY departures</Text>
                </View>
                <View style={[styles.column, styles.rightColumn]}>
                    <Text style={styles.columnHeaderText}>S.G.W departures</Text>
                </View>
            </View>
            <View style={styles.tableContent}>
                {loyolaTimes.map((_, index) => (
                    <View key={index} style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.timeText}>
                                {loyolaTimes[index] || ''}
                            </Text>
                        </View>
                        <View style={[styles.column, styles.rightColumn]}>
                            <Text style={styles.timeText}>
                                {sgwTimes[index] || ''}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {renderScheduleSection(
                'Monday — Thursday',
                loyolaStop?.departureTimes.monday_to_thursday || [],
                sgwStop?.departureTimes.monday_to_thursday || []
            )}

            {renderScheduleSection(
                'Friday',
                loyolaStop?.departureTimes.friday || [],
                sgwStop?.departureTimes.friday || []
            )}
        </ScrollView>
    );
};

export default FullShuttleSchedule;