// app/(tabs)/AddScoreScreen.tsx
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useResponsive } from '../../ context/ResponsiveContext';
import { COLORS } from '../../constants/Colors';
import { HoleData, PlayerStats, ScoreData } from '../../types';

const { width } = Dimensions.get('window');
// Remove hook call from top level

const AddScoreScreen: React.FC = () => {
  const router = useRouter();
  const { wp, hp, vs, ms, isSmallDevice, isMediumDevice, isLargeDevice } = useResponsive();
 const getStyles = () => {
    return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      borderBottomWidth: 1,
      borderBottomColor: '#EFEFEF',
      backgroundColor: '#fff',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    backButton: {
      width: vs(40),
      height: vs(40),
      borderRadius: vs(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: ms(20),
      fontWeight: '600',
      color: '#000000',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      width: vs(40),
      height: vs(40),
      borderRadius: vs(20),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp(2),
    },
    navigationBackground: {
  width: '100%',
},
holeNavigation: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
},
navButton: {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
},
holeNumberContainer: {
  width: 110,
  height: 110,
  borderRadius: 55,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    android: {
      elevation: 8,
    },
  }),
},
holeNumber: {
  fontSize: 60,
  fontWeight: 'bold',
  color: COLORS.primary,
},
holeInfoContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 40,
  paddingBottom: 20,
  paddingTop: 5,
},
holeInfoBox: {
  alignItems: 'center',
},
holeInfoLabel: {
  fontSize: 16,
  fontWeight: '600',
  color: '#FFFFFF',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: 1,
},
holeInfoValue: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#FFFFFF',
  textShadowColor: 'rgba(0, 0, 0, 0.2)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},
   
    playerInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#EFEFEF',
      marginBottom: hp(1),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    playerInfoLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    playerAvatar: {
      width: vs(60),
      height: vs(60),
      borderRadius: vs(30),
      marginRight: wp(4),
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    playerNameContainer: {
      justifyContent: 'center',
    },
    playerName: {
      fontSize: ms(20),
      fontWeight: '600',
      color: '#000000',
      marginBottom: hp(0.5),
    },
    playerHandicap: {
      fontSize: ms(14),
      color: COLORS.secondary,
    },
    playerScoreCircle: {
      width: vs(70),
      height: vs(70),
      borderRadius: vs(35),
      borderWidth: 3,
      borderColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        android: {
          elevation: 4,
        },
      }),
      position: 'relative',
    },
    playerScoreText: {
      fontSize: ms(32, 0.3),
      fontWeight: 'bold',
    },
    playerScoreSubtext: {
      fontSize: ms(16),
      color: COLORS.primary,
      position: 'absolute',
      right: 15,
      bottom: 5,
    },
    scoreDescription: {
      position: 'absolute',
      top: -hp(3),
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.25),
      borderRadius: 10,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    scoreDescriptionText: {
      fontSize: ms(12),
      fontWeight: 'bold',
    },
    trackingContainer: {
      padding: wp(4),
      backgroundColor: '#FFFFFF',
      marginHorizontal: wp(2),
      borderRadius: 12,
      marginBottom: hp(1),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    trackingRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: hp(3),
    },
    trackingChart: {
      width: isSmallDevice ? wp(32) : wp(35),
      height: isSmallDevice ? wp(32) : wp(35),
      borderRadius: isSmallDevice ? wp(16) : wp(17.5),
      borderWidth: 1,
      borderColor: '#EFEFEF',
      backgroundColor: '#F8F8F8',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    chartCenter: {
      position: 'absolute',
      width: vs(40),
      height: vs(40),
      borderRadius: vs(20),
      backgroundColor: '#E5E5E5',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#D0D0D0',
    },
    chartCenterText: {
      fontSize: ms(14),
      fontWeight: '600',
      color: COLORS.primary,
    },
    chartText: {
      fontSize: ms(18),
      fontWeight: '600',
      color: COLORS.primary,
      position: 'absolute',
      zIndex: 10,
    },
    chartSegmentFR: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '50%',
      height: '50%',
      borderBottomRightRadius: isSmallDevice ? wp(16) : wp(17.5),
    },
    chartSegmentGIR: {
      position: 'absolute',
      top: 0,
      width: '50%',
      height: '50%',
      borderBottomLeftRadius: isSmallDevice ? wp(16) : wp(17.5),
      right: 0,
    },
    checkboxRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: isSmallDevice ? 'wrap' : 'nowrap',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isSmallDevice ? hp(1) : 0,
      width: isSmallDevice ? '48%' : 'auto',
    },
    checkbox: {
      width: vs(30),
      height: vs(30),
      borderRadius: 6,
      borderWidth: 2,
      borderColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      backgroundColor: '#FFF',
    },
    checkboxChecked: {
      backgroundColor: COLORS.primary,
    },
    checkboxLabel: {
      fontSize: ms(16),
      fontWeight: '600',
      color: '#000000',
    },
    penaltyContainer: {
      alignItems: 'center',
      width: isSmallDevice ? '100%' : 'auto',
      marginTop: isSmallDevice ? hp(1) : 0,
    },
    penaltyControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: wp(25),
      marginBottom: hp(0.5),
    },
    penaltyButton: {
      width: vs(28),
      height: vs(28),
      borderRadius: vs(14),
      backgroundColor: '#F0F0F0',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    penaltyValue: {
      fontSize: ms(30, 0.3),
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    penaltyLabel: {
      fontSize: ms(16),
      fontWeight: '600',
      color: '#000000',
    },
    scoreContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: wp(4),
      backgroundColor: '#FFFFFF',
      marginHorizontal: wp(2),
      borderRadius: 12,
      marginBottom: hp(1),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    scoreBox: {
      alignItems: 'center',
      width: '45%',
    },
    scoreLabel: {
      fontSize: ms(18),
      fontWeight: '600',
      color: '#000000',
      marginBottom: hp(1.5),
    },
    scoreControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    scoreButton: {
      width: vs(40),
      height: vs(40),
      borderRadius: vs(20),
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    scoreButtonLeft: {
      backgroundColor: COLORS.primaryDark,
    },
    scoreButtonRight: {
      backgroundColor: COLORS.primaryLight,
    },
    scoreValue: {
      fontSize: ms(48, 0.3),
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    submitContainer: {
      padding: wp(4),
      alignItems: 'center',
    },
    submitButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: wp(5),
      paddingVertical: hp(1.5),
      borderRadius: 30,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    submitText: {
      fontSize: ms(18),
      fontWeight: '600',
      color: COLORS.accent,
      marginLeft: 8,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      paddingHorizontal: wp(4),
      paddingBottom: hp(2),
    },
    progressDot: {
      width: vs(12),
      height: vs(12),
      borderRadius: vs(6),
      backgroundColor: '#EFEFEF',
      margin: 4,
      borderWidth: 1,
      borderColor: '#DADADA',
    },
    progressDotActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
      width: vs(16),
      height: vs(16),
      borderRadius: vs(8),
      margin: 2,
    },
    progressDotCompleted: {
      backgroundColor: COLORS.chartGreen,
      borderColor: COLORS.chartGreen,
    },
    });
  };
   const styles = getStyles();
  const [currentHole, setCurrentHole] = useState<number>(1);
  const [score, setScore] = useState<number>(4);
  const [putts, setPutts] = useState<number>(2);
  const [sandieChecked, setSandieChecked] = useState<boolean>(false);
  const [upDownChecked, setUpDownChecked] = useState<boolean>(false);
  const [penalty, setPenalty] = useState<number>(0);
  const [scoreData, setScoreData] = useState<Record<number, ScoreData>>({});
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalScore: 0,
    totalOver: 0,
    fairwaysHit: 0,
    greensInRegulation: 0,
    upAndDowns: 0,
    sandSaves: 0,
    totalPutts: 0,
    totalHolesPlayed: 0
  });
  const [animation] = useState(new Animated.Value(0));
  const [submitAnim] = useState(new Animated.Value(0));
  
  const [holeData, setHoleData] = useState<Record<number, HoleData>>({
    1: { yards: 200, par: 3, index: 12 },
    2: { yards: 314, par: 4, index: 17 },
    3: { yards: 324, par: 4, index: 11 },
    4: { yards: 295, par: 4, index: 15 },
    5: { yards: 368, par: 4, index: 7 },
    6: { yards: 182, par: 3, index: 13 },
    7: { yards: 365, par: 4, index: 3 },
    8: { yards: 513, par: 5, index: 5 },
    9: { yards: 327, par: 4, index: 9 },
    10: { yards: 116, par: 4, index: 18 },
    11: { yards: 316, par: 4, index: 12 },
    12: { yards: 400, par: 4, index: 10 },
    13: { yards: 150, par: 4, index: 14 },
    14: { yards: 154, par: 4, index: 6 },
    15: { yards: 319, par: 3, index: 8 },
    16: { yards: 493, par: 4, index: 4 },
    17: { yards: 410, par: 5, index: 2 },
    18: { yards: 305, par: 4, index: 16 },
  });

  useEffect(() => {
    loadSavedScores();
    loadPlayerStats();
    
    // Run entrance animation
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
  }, []);

  // Calculate score relative to par
  const getScoreRelativeToPar = (score: number, par: number): string => {
    const diff = score - par;
    if (diff === 0) return 'E'; // Even par
    if (diff > 0) return `+${diff}`; // Over par
    return diff.toString(); // Under par (already has the negative sign)
  };

  // Get score description
  const getScoreDescription = (score: number, par: number): string => {
    const diff = score - par;
    if (diff === -2) return 'Eagle';
    if (diff === -1) return 'Birdie';
    if (diff === 0) return 'Par';
    if (diff === 1) return 'Bogey';
    if (diff === 2) return 'Double Bogey';
    if (diff > 2) return 'Triple+ Bogey';
    if (diff < -2) return 'Albatross+';
    return '';
  };

  // Get score color
  const getScoreColor = (score: number, par: number): string => {
    const diff = score - par;
    if (diff <= -2) return COLORS.eagle;
    if (diff === -1) return COLORS.birdie;
    if (diff === 0) return COLORS.par;
    if (diff === 1) return COLORS.bogey;
    return COLORS.doubleBogey;
  };

  const loadPlayerStats = async (): Promise<void> => {
    try {
      const savedStats = await AsyncStorage.getItem('playerStats');
      if (savedStats !== null) {
        setPlayerStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading player stats', error);
    }
  };

  const savePlayerStats = async (stats: PlayerStats): Promise<void> => {
    try {
      await AsyncStorage.setItem('playerStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving player stats', error);
    }
  };

  const loadSavedScores = async (): Promise<void> => {
    try {
      const savedScores = await AsyncStorage.getItem('golfScores');
      if (savedScores !== null) {
        const parsedScores = JSON.parse(savedScores);
        setScoreData(parsedScores);
        
        // Load the current hole's data if it exists
        if (parsedScores[currentHole]) {
          loadHoleData(currentHole, parsedScores);
        }
        
        // Calculate overall stats from saved scores
        calculateOverallStats(parsedScores);
      }
    } catch (error) {
      console.error('Error loading scores', error);
    }
  };
const calculateStrokesGained = (score: number, par: number, index: number): number => {
  // Calculate expected strokes based on hole difficulty (index)
  // Higher index means easier hole, lower index means harder hole
  // This is a simplified version of strokes gained calculation
  const difficulty = (19 - index) / 18; // Convert index to a 0-1 scale
  const expectedScore = par + (difficulty * 0.5); // Adjust expected score based on difficulty
  
  return expectedScore - score;
};
 const calculateOverallStats = (scores: Record<number, ScoreData>): void => {
  const stats: PlayerStats = {
    totalScore: 0,
    totalOver: 0,
    fairwaysHit: 0,
    greensInRegulation: 0,
    upAndDowns: 0,
    sandSaves: 0,
    totalPutts: 0,
    totalHolesPlayed: Object.keys(scores).length
  };
//   console.log('Scores:', scores);
  // Calculate the total expected par for the course
  const totalPar = Object.keys(holeData).reduce((total, holeKey) => {
    const hole = parseInt(holeKey);
    return total + holeData[hole].par;
  }, 0);
  
  // Sum up all scores and statistics
  Object.entries(scores).forEach(([holeKey, holeData]) => {
    const hole = parseInt(holeKey);
    const par = holeData[hole]?.par || 4; // Default to par 4 if not found
    
    stats.totalScore += holeData.score || 0;
    stats.totalPutts += holeData.putts || 0;
    
    // Count fairways hit
    if (holeData.fairwayHit) {
      stats.fairwaysHit += 1;
    }
    
    // Count greens in regulation
    if (holeData.greenInRegulation) {
      stats.greensInRegulation += 1;
    }
    
    // Count up and downs
    if (holeData.upDown) {
      stats.upAndDowns += 1;
    }
    
    // Count sand saves
    if (holeData.sandie) {
      stats.sandSaves += 1;
    }
  });
  
  // Calculate total over par
  stats.totalOver = stats.totalScore - totalPar;
  
  setPlayerStats(stats);
  savePlayerStats(stats);
};


  const saveScores = async (newScoreData: Record<number, ScoreData>): Promise<void> => {
    try {
      await AsyncStorage.setItem('golfScores', JSON.stringify(newScoreData));
      // Recalculate stats after saving
      calculateOverallStats(newScoreData);
    } catch (error) {
      console.error('Error saving scores', error);
    }
  };

  const handlePreviousHole = (): void => {
    if (currentHole > 1) {
      // Save current hole data before switching
      handleSaveCurrent();
      
      // Animate transition
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      setCurrentHole(currentHole - 1);
      loadHoleData(currentHole - 1);
    }
  };

  const handleNextHole = (): void => {
    if (currentHole < 18) {
      // Save current hole data before switching
      handleSaveCurrent();
      
      // Animate transition
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      setCurrentHole(currentHole + 1);
      loadHoleData(currentHole + 1);
    }
  };

  const handleSaveCurrent = (): void => {
    // Quietly save the current hole data without showing an alert
    const updatedScoreData = {
      ...scoreData,
      [currentHole]: {
        score,
        putts,
        sandie: sandieChecked,
        upDown: upDownChecked,
        penalty,
        fairwayHit: sandieChecked, // For statistics
        greenInRegulation: upDownChecked // For statistics
      },
    };
    
    setScoreData(updatedScoreData);
    saveScores(updatedScoreData);
  };
  const updatePlayerScoreDisplay = (newScore: number, newPutts: number): void => {
  // Animate player score change
  Animated.sequence([
    Animated.timing(animation, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true
    }),
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    })
  ]).start();
};

  const loadHoleData = (hole: number, scoresData?: Record<number, ScoreData>): void => {
  const data = scoresData || scoreData;
  if (data[hole]) {
    const holeScore = data[hole];
    setScore(holeScore.score || 4);
    setPutts(holeScore.putts || 2);
    setSandieChecked(holeScore.sandie || false);
    setUpDownChecked(holeScore.upDown || false);
    setPenalty(holeScore.penalty || 0);
    
    // If we have stroke data, update player score display
    updatePlayerScoreDisplay(holeScore.score || 4, holeScore.putts || 2);
  } else {
    // Default values if no data exists
    setScore(4);
    setPutts(2);
    setSandieChecked(false);
    setUpDownChecked(false);
    setPenalty(0);
    
    // Reset player score display
    updatePlayerScoreDisplay(4, 2);
  }
};

  const isGreenInRegulation = (score: number, putts: number, par: number): boolean => {
  // GIR means reaching the green with enough strokes left for 2 putts
  // For par 3: reach green in 1 stroke
  // For par 4: reach green in 2 strokes
  // For par 5: reach green in 3 strokes
  const strokesToGreen = score - putts;
  return strokesToGreen <= par - 2;
};

// Determine if the player achieved a Sand Save
const isSandSave = (sandieChecked: boolean, score: number, par: number): boolean => {
  // A sand save is when a player gets up-and-down from a bunker
  // (gets the ball in the hole in no more than 2 strokes from a bunker)
  // AND scores par or better
  return sandieChecked && score <= par;
};

 const handleSubmitScore = (): void => {
  // Determine if this is a green in regulation
  const gir = isGreenInRegulation(score, putts, holeData[currentHole].par);
  
  // Determine if this is a sand save
  const sandSave = isSandSave(sandieChecked, score, holeData[currentHole].par);
  
  const updatedScoreData = {
    ...scoreData,
    [currentHole]: {
      score,
      putts,
      sandie: sandieChecked,
      upDown: upDownChecked,
      penalty,
      fairwayHit: sandieChecked, // Simplification: using sandie checkbox to indicate fairway hit
      greenInRegulation: gir // Use calculated GIR instead of directly using upDown checkbox
    },
  };
  
  // Run submit animation
  Animated.sequence([
    Animated.timing(submitAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }),
    Animated.timing(submitAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    })
  ]).start();
  
  setScoreData(updatedScoreData);
  saveScores(updatedScoreData);
  
  // Display appropriate message based on performance
  let message = 'Score saved successfully';
  const par = holeData[currentHole].par;
  const scoreToPar = score - par;
  
  if (scoreToPar <= -2) {
    message = 'Eagle or better! Incredible shot!';
  } else if (scoreToPar === -1) {
    message = 'Birdie! Great play!';
  } else if (scoreToPar === 0) {
    message = 'Par. Solid play!';
  } else if (scoreToPar === 1) {
    message = 'Bogey. Not bad!';
  } else if (scoreToPar === 2) {
    message = 'Double Bogey. Keep it up!';
  }
  
  // Show a toast-style notification
  Alert.alert('Success', message);
  
  // Automatically advance to next hole if not on 18
  if (currentHole < 18) {
    setTimeout(() => handleNextHole(), 500);
  } else {
    // Show summary if completed all 18 holes
    const completedHoles = Object.keys(updatedScoreData).length;
    if (completedHoles >= 18) {
      setTimeout(() => {
        Alert.alert(
          'Round Complete!',
          `Total Score: ${playerStats.totalScore}\nTo Par: ${getScoreRelativeToPar(playerStats.totalScore, 72)}\nPutts: ${playerStats.totalPutts}`,
          [
            { text: 'OK' },
            { 
              text: 'View Scorecard', 
              onPress: () => navigateToScorecard() 
            }
          ]
        );
      }, 1000);
    }
  }
};

  const navigateToScorecard = (): void => {
    // Save current data before navigating
    handleSaveCurrent();
    router.push('/(tabs)/ScorecardScreen');
  };

  const decrementScore = (): void => {
  if (score > 1) {
    const newScore = score - 1;
    setScore(newScore);
    updatePlayerScoreDisplay(newScore, putts);
    
    // Provide haptic feedback if available
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

  const incrementScore = (): void => {
  const newScore = score + 1;
  setScore(newScore);
  updatePlayerScoreDisplay(newScore, putts);
  
  // Provide haptic feedback if available
  // This would require react-native-haptic-feedback library
  // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

  const decrementPutts = (): void => {
  if (putts > 0) {
    const newPutts = putts - 1;
    setPutts(newPutts);
    updatePlayerScoreDisplay(score, newPutts);
  }
};

  const incrementPutts = (): void => {
  const newPutts = putts + 1;
  setPutts(newPutts);
  updatePlayerScoreDisplay(score, newPutts);
  
  // If putts exceeds score, increase score to match
  if (newPutts > score) {
    setScore(newPutts);
  }
};
  const incrementPenalty = (): void => {
    setPenalty(penalty + 1);
  };

  const decrementPenalty = (): void => {
    if (penalty > 0) {
      setPenalty(penalty - 1);
    }
  };

  // Animation styles
  const animatedStyles = {
    transform: [
      { 
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1]
        }) 
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0]
        })
      }
    ],
    opacity: animation
  };
  
  const submitAnimatedStyles = {
    transform: [
      { 
        scale: submitAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.2, 1]
        }) 
      }
    ]
  };

  return (
    <SafeAreaView style={styles.safeArea}>
         <ScrollView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Qutab Golf course</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}onPress={navigateToScorecard}>
              <MaterialIcons name="grid-on" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={navigateToScorecard}>
              <FontAwesome6 name="user-tag" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hole Navigation */}
       <ImageBackground 
  source={require('../../assets/images/golf-pattern-bg.png')} 
  style={styles.navigationBackground}
  imageStyle={{ opacity: 0.15 }}
>
  <LinearGradient
    colors={[COLORS.primaryDark, COLORS.primary]}
    style={styles.holeNavigation}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
  >
    <TouchableOpacity 
      style={styles.navButton} 
      onPress={handlePreviousHole}
      activeOpacity={0.7}
    >
      <MaterialIcons name="chevron-left" size={40} color="white" />
    </TouchableOpacity>
    
    <Animated.View style={[styles.holeNumberContainer, animatedStyles]}>
      <Text style={styles.holeNumber}>{currentHole}</Text>
    </Animated.View>
    
    <TouchableOpacity 
      style={styles.navButton} 
      onPress={handleNextHole}
      activeOpacity={0.7}
    >
      <MaterialIcons name="chevron-right" size={40} color="white" />
    </TouchableOpacity>
  </LinearGradient>

  {/* Hole Info */}
  <LinearGradient
    colors={[COLORS.primary, COLORS.primaryLight]}
    style={styles.holeInfoContainer}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
  >
    <View style={styles.holeInfoBox}>
      <Text style={styles.holeInfoLabel}>YARDS</Text>
      <Text style={styles.holeInfoValue}>{holeData[currentHole].yards}</Text>
    </View>
    
    <View style={styles.holeInfoBox}>
      <Text style={styles.holeInfoLabel}>PAR</Text>
      <Text style={styles.holeInfoValue}>{holeData[currentHole].par}</Text>
    </View>
    
    <View style={styles.holeInfoBox}>
      <Text style={styles.holeInfoLabel}>INDEX</Text>
      <Text style={styles.holeInfoValue}>{holeData[currentHole].index}</Text>
    </View>
  </LinearGradient>
</ImageBackground>

        {/* Player Info */}
        <Animated.View style={[styles.playerInfoContainer, animatedStyles]}>
          <View style={styles.playerInfoLeft}>
            <Image
              source={require('../../assets/images/avatar-placeholder.png')}
              style={styles.playerAvatar}
            />
            <View style={styles.playerNameContainer}>
              <Text style={styles.playerName}>James Gordon</Text>
              <Text style={styles.playerHandicap}>
                HCAP 4   |   Total: {playerStats.totalScore} ({getScoreRelativeToPar(playerStats.totalScore, 72)})
              </Text>
            </View>
          </View>
          <View style={styles.playerScoreCircle}>
            <Text style={[styles.playerScoreText, {
              color: getScoreColor(score, holeData[currentHole].par)
            }]}>{score}</Text>
            <Text style={styles.playerScoreSubtext}>{putts}</Text>
            <View style={styles.scoreDescription}>
              <Text style={[styles.scoreDescriptionText, {
                color: getScoreColor(score, holeData[currentHole].par)
              }]}>
                {getScoreDescription(score, holeData[currentHole].par)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Tracking Options */}
        <Animated.View style={[styles.trackingContainer, animatedStyles]}>
          <View style={styles.trackingRow}>
            <View style={styles.trackingChart}>
              <Text style={styles.chartText}>FR</Text>
              <View style={[styles.chartSegmentFR, { backgroundColor: sandieChecked ? COLORS.chartGreen : 'transparent' }]} />
              
            </View>
            <View style={styles.trackingChart}>
              <Text style={styles.chartText}>GIR</Text>
              <View style={[styles.chartSegmentGIR, { backgroundColor: upDownChecked ? COLORS.chartGreen : 'transparent' }]} />
             
            </View>
          </View>

          {/* Checkboxes */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setSandieChecked(!sandieChecked)}
            >
              <View style={[styles.checkbox, sandieChecked && styles.checkboxChecked]}>
                {sandieChecked && <MaterialIcons name="check" size={24} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>SANDIE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setUpDownChecked(!upDownChecked)}
            >
              <View style={[styles.checkbox, upDownChecked && styles.checkboxChecked]}>
                {upDownChecked && <MaterialIcons name="check" size={24} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>UP/DOWN</Text>
            </TouchableOpacity>
            
            <View style={styles.penaltyContainer}>
              <View style={styles.penaltyControls}>
                <TouchableOpacity 
                  style={styles.penaltyButton} 
                  onPress={decrementPenalty}
                >
                  <MaterialIcons name="remove" size={18} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.penaltyValue}>{penalty}</Text>
                <TouchableOpacity 
                  style={styles.penaltyButton} 
                  onPress={incrementPenalty}
                >
                  <MaterialIcons name="add" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.penaltyLabel}>PENALTY</Text>
            </View>
          </View>
        </Animated.View>

        {/* Score and Putts */}
        <Animated.View style={[styles.scoreContainer, animatedStyles]}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Score</Text>
            <View style={styles.scoreControls}>
              <TouchableOpacity 
                style={[styles.scoreButton, styles.scoreButtonLeft]} 
                onPress={decrementScore}
              >
                <MaterialIcons name="remove" size={24} color="white" />
              </TouchableOpacity>
              <Text style={[styles.scoreValue, {
                color: getScoreColor(score, holeData[currentHole].par)
              }]}>{score}</Text>
              <TouchableOpacity 
                style={[styles.scoreButton, styles.scoreButtonRight]} 
                onPress={incrementScore}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Putts</Text>
            <View style={styles.scoreControls}>
              <TouchableOpacity 
                style={[styles.scoreButton, styles.scoreButtonLeft]} 
                onPress={decrementPutts}
              >
                <MaterialIcons name="remove" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.scoreValue}>{putts}</Text>
              <TouchableOpacity 
                style={[styles.scoreButton, styles.scoreButtonRight]} 
                onPress={incrementPutts}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View style={[styles.submitContainer, animatedStyles]}>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmitScore}
            activeOpacity={0.8}
          >
            <Animated.View style={submitAnimatedStyles}>
              <MaterialIcons name="check-circle" size={28} color={COLORS.accent} />
            </Animated.View>
            <Text style={styles.submitText}>Sharing Scores!</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Hole Progress Indicator */}
        <View style={styles.progressContainer}>
          {Array.from({length: 18}, (_, i) => (
            <TouchableOpacity 
              key={i} 
              style={[
                styles.progressDot,
                currentHole === i+1 && styles.progressDotActive,
                scoreData[i+1] ? styles.progressDotCompleted : null
              ]}
              onPress={() => {
                handleSaveCurrent();
                setCurrentHole(i+1);
                loadHoleData(i+1);
              }}
            />
          ))}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};




export default AddScoreScreen;