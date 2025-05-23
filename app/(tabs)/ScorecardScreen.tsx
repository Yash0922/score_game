// app/(tabs)/ScorecardScreen.tsx
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../constants/Colors';
import { CourseData, PlayerData, ScoreData } from '../../types';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Create responsive dimension utilities
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;
const isSmallDevice = height < 700;

const ScorecardScreen: React.FC = () => {
  const router = useRouter();
  const [scoreData, setScoreData] = useState<Record<number, ScoreData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandAnim] = useState(new Animated.Value(0));
  const [activePlayer, setActivePlayer] = useState<string>('Dinesh Thakur');

  // Animation values for expand/collapse
  const animatedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hp(30)], // Adjust based on content
  });

  // Animated opacity for fade-in effect
  const [fadeAnim] = useState(new Animated.Value(0));

  // Scorecard data
  const courseData: CourseData = {
    name: 'Qutab Golf Course',
    date: '2nd Feb, 2022 (Wed)',
    frontNine: {
      holes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      par: [4, 4, 4, 4, 4, 3, 4, 5, 4],
      yards: [420, 314, 324, 295, 368, 182, 365, 513, 327],
      index: [1, 17, 11, 15, 7, 13, 3, 5, 9],
    },
    backNine: {
      holes: [10, 11, 12, 13, 14, 15, 16, 17, 18],
      par: [4, 4, 4, 4, 4, 3, 4, 5, 4],
      yards: [116, 316, 400, 150, 154, 319, 493, 410, 305],
      index: [18, 12, 10, 14, 6, 8, 4, 2, 16],
    },
  };

  // Default player data
  const emptyPlayerData: PlayerData = {
  name: 'Dinesh Thakur',
  scores: {
    front: Array(9).fill(null),
    back: Array(9).fill(null),
  },
  putts: {
    front: Array(9).fill(null),
    back: Array(9).fill(null),
  },
  fir: {
    front: Array(9).fill(null),
    back: Array(9).fill(null),
  },
  reg: {
    front: Array(9).fill(null),
    back: Array(9).fill(null),
  },
  upDown: {
    front: Array(9).fill(null),
    back: Array(9).fill(null),
  },
  penalty: {
    front: Array(9).fill(null),
    back: Array(9).fill(null),
  },
};

  // Create state for player data that will be updated with saved scores
  const [playerData, setPlayerData] = useState<PlayerData>(emptyPlayerData);


  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      // Collapse
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setTimeout(() => setExpandedSection(null), 300);
    } else {
      // Expand
      setExpandedSection(section);
      Animated.timing(expandAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    loadSavedScores();

    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

const loadSavedScores = async (): Promise<void> => {
  setIsLoading(true);
  try {
    const savedScores = await AsyncStorage.getItem('golfScores');
    if (savedScores !== null) {
      const parsedScores = JSON.parse(savedScores);
      setScoreData(parsedScores);
      
      // Update player data with saved scores
      updatePlayerDataFromSavedScores(parsedScores);
    }
  } catch (error) {
    console.error('Error loading scores', error);
  } finally {
    setIsLoading(false);
  }
};

  // Update player data with saved scores
  const updatePlayerDataFromSavedScores = (savedScores: Record<number, ScoreData>) => {
    const updatedPlayerData = { ...emptyPlayerData };
    
    // Fill in saved scores for each hole
    Object.entries(savedScores).forEach(([holeKey, holeData]) => {
      const hole = parseInt(holeKey);
      const holeIndex = hole <= 9 ? hole - 1 : hole - 10;
      const section = hole <= 9 ? 'front' : 'back';
      
      if (holeData.score) {
        updatedPlayerData.scores[section][holeIndex] = holeData.score;
      }
      
      if (holeData.putts) {
        updatedPlayerData.putts[section][holeIndex] = holeData.putts;
      }
      
      if (holeData.sandie !== undefined) {
        updatedPlayerData.fir[section][holeIndex] = holeData.sandie;
      }
      
      if (holeData.upDown !== undefined) {
        updatedPlayerData.upDown[section][holeIndex] = holeData.upDown;
      }
      
      if (holeData.penalty !== undefined) {
        updatedPlayerData.penalty[section][holeIndex] = holeData.penalty;
      }
    });
    
    setPlayerData(updatedPlayerData);
  };
const calculateTotals = (array: (number | null)[]): number => {
  return array.reduce((total, num) => total + (num ?? 0), 0);
};


  const getFrontNineTotal = (): number => {
    return calculateTotals(playerData.scores.front);
  };

  const getBackNineTotal = (): number => {
    return calculateTotals(playerData.scores.back);
  };

  const getTotalScore = (): number => {
    return getFrontNineTotal() + getBackNineTotal();
  };

  const getScoreClass = (score: number | null, par: number): any => {
  if (score === null) return null;
  if (score === par - 1) return styles.birdie;
  if (score === par + 1) return styles.bogey;
  if (score >= par + 2) return styles.doubleBogey;
  if (score <= par - 2) return styles.eagle;
  return null;
};

  const getScoreColor = (score: number | null, par: number): string => {
  if (score === null) return '#888888'; // Gray for unrecorded scores
  if (score === par - 1) return COLORS.birdie; // Birdie - Red
  if (score === par + 1) return COLORS.bogey; // Bogey - Blue
  if (score >= par + 2) return COLORS.doubleBogey; // Double Bogey - Black
  if (score <= par - 2) return COLORS.eagle; // Eagle - Yellow
  return '#000000'; // Par - Black
};


  // Get scorecard cell size that fits the screen width
  const getCellSize = () => {
    const cellCount = 11; // 9 holes + OUT + placeholder cell
    const cellWidth = Math.max(wp(6), 40); // Min width of 40 or 6% of screen width
    return cellWidth;
  };

  const cellSize = getCellSize();
const isRoundComplete = (): boolean => {
  const frontNineComplete = !playerData.scores.front.some(score => score === null);
  const backNineComplete = !playerData.scores.back.some(score => score === null);
  return frontNineComplete && backNineComplete;
};
  // Player statistics summary
  const playerStatsSummary = useMemo(() => {
  // Calculate fairways hit from non-null values only
  const frontFairwaysRecorded = playerData.fir.front.filter(val => val !== null).length;
  const backFairwaysRecorded = playerData.fir.back.filter(val => val !== null).length;
  const frontFairwaysHit = playerData.fir.front.filter(val => val === true).length;
  const backFairwaysHit = playerData.fir.back.filter(val => val === true).length;
  
  // Similarly for greens and up/downs...
  
  return {
    totalScore: calculateTotals(playerData.scores.front) + calculateTotals(playerData.scores.back),
    totalPar: calculateTotals(courseData.frontNine.par) + calculateTotals(courseData.backNine.par),
    totalPutts: calculateTotals(playerData.putts.front) + calculateTotals(playerData.putts.back),
    fairwaysHit: frontFairwaysHit + backFairwaysHit,
    totalFairways: frontFairwaysRecorded + backFairwaysRecorded,
    // ... and so on for other statistics
    isComplete: isRoundComplete()
  };
}, [playerData]);
const getPredictedScore = (): number | null => {
  if (isRoundComplete()) {
    return playerStatsSummary.totalScore; // Actual score for complete rounds
  }
  
  // Count non-null scores and their total
  const frontScores = playerData.scores.front.filter(score => score !== null);
  const backScores = playerData.scores.back.filter(score => score !== null);
  const recordedScores = [...frontScores, ...backScores] as number[];
  
  if (recordedScores.length < 5) { // Need at least 5 holes to make a reasonable prediction
    return null;
  }
  
  // Calculate average score per hole from recorded scores
  const avgScorePerHole = recordedScores.reduce((sum, score) => sum + score, 0) / recordedScores.length;
  
  // Calculate holes remaining
  const holesRemaining = 18 - recordedScores.length;
  
  // Predict final score (current score + projected remaining score)
  return Math.round(playerStatsSummary.totalScore + (avgScorePerHole * holesRemaining));
};
const renderPredictedScore = () => {
  if (isRoundComplete()) return null;
  
  const predictedScore = getPredictedScore();
  if (predictedScore === null) return null;
  
  return (
    <View style={styles.predictedScoreContainer}>
      <Text style={styles.predictedScoreLabel}>Projected Score:</Text>
      <Text style={styles.predictedScoreValue}>{predictedScore}</Text>
    </View>
  );
};
  // Calculate score to par
  const getScoreToPar = (): string => {
    const diff = playerStatsSummary.totalScore - playerStatsSummary.totalPar;
    if (diff === 0) return 'E';
    if (diff > 0) return `+${diff}`;
    return diff.toString();
  };

  // Render detailed statistics when expanded
  const renderDetailedStats = () => {
    return (
      <Animated.View style={[styles.detailedStatsContainer, { maxHeight: animatedHeight }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Score to Par</Text>
            <Text style={[styles.statValue, { 
              color: getScoreToPar() === 'E' ? COLORS.par : 
                    getScoreToPar().startsWith('+') ? COLORS.bogey : COLORS.birdie 
            }]}>{getScoreToPar()}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Putts</Text>
            <Text style={styles.statValue}>{playerStatsSummary.totalPutts}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Penalties</Text>
            <Text style={styles.statValue}>{playerStatsSummary.penalties}</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Fairways</Text>
            <Text style={styles.statValue}>
              {playerStatsSummary.fairwaysHit}/{playerStatsSummary.totalFairways} ({Math.round((playerStatsSummary.fairwaysHit / playerStatsSummary.totalFairways) * 100)}%)
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Greens</Text>
            <Text style={styles.statValue}>
              {playerStatsSummary.greensInReg}/{playerStatsSummary.totalGreens} ({Math.round((playerStatsSummary.greensInReg / playerStatsSummary.totalGreens) * 100)}%)
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Up & Downs</Text>
            <Text style={styles.statValue}>{playerStatsSummary.upAndDowns}</Text>
          </View>
        </View>
        
        <View style={styles.statsBreakdown}>
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: COLORS.eagle }]} />
            <Text style={styles.breakdownLabel}>Eagles: </Text>
            <Text style={styles.breakdownValue}>
              {playerData.scores.front.concat(playerData.scores.back)
                .filter((score, idx) => {
                  const par = idx < 9 ? courseData.frontNine.par[idx] : courseData.backNine.par[idx - 9];
                  return score <= par - 2;
                }).length}
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: COLORS.birdie }]} />
            <Text style={styles.breakdownLabel}>Birdies: </Text>
            <Text style={styles.breakdownValue}>
              {playerData.scores.front.concat(playerData.scores.back)
                .filter((score, idx) => {
                  const par = idx < 9 ? courseData.frontNine.par[idx] : courseData.backNine.par[idx - 9];
                  return score === par - 1;
                }).length}
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: COLORS.par }]} />
            <Text style={styles.breakdownLabel}>Pars: </Text>
            <Text style={styles.breakdownValue}>
              {playerData.scores.front.concat(playerData.scores.back)
                .filter((score, idx) => {
                  const par = idx < 9 ? courseData.frontNine.par[idx] : courseData.backNine.par[idx - 9];
                  return score === par;
                }).length}
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: COLORS.bogey }]} />
            <Text style={styles.breakdownLabel}>Bogeys: </Text>
            <Text style={styles.breakdownValue}>
              {playerData.scores.front.concat(playerData.scores.back)
                .filter((score, idx) => {
                  const par = idx < 9 ? courseData.frontNine.par[idx] : courseData.backNine.par[idx - 9];
                  return score === par + 1;
                }).length}
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownDot, { backgroundColor: COLORS.doubleBogey }]} />
            <Text style={styles.breakdownLabel}>Doubles+: </Text>
            <Text style={styles.breakdownValue}>
              {playerData.scores.front.concat(playerData.scores.back)
                .filter((score, idx) => {
                  const par = idx < 9 ? courseData.frontNine.par[idx] : courseData.backNine.par[idx - 9];
                  return score >= par + 2;
                }).length}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading scorecard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/AddScoreScreen')}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Score Card - {courseData.date}</Text>
        </View>

        {/* Course Name & Player Summary */}
        <View style={styles.courseSummary}>
          <Text style={styles.courseName}>{courseData.name}</Text>
          
          <TouchableOpacity 
            style={styles.playerSummary}
            onPress={() => toggleSection('playerStats')}
          >
            <View style={styles.playerInfoHeader}>
              <Text style={[styles.playerName,{color:COLORS.bogey }]}>{playerData.name}</Text>
              
              <View style={styles.scoreDisplay}>
                <Text style={styles.totalScoreText}>{playerStatsSummary.totalScore}</Text>
                <Text style={[styles.parDifferenceText, { 
                  color: getScoreToPar() === 'E' ? COLORS.par : 
                         getScoreToPar().startsWith('+') ? COLORS.bogey : COLORS.birdie 
                }]}>
                  ({getScoreToPar()})
                </Text>
              </View>
              
              <MaterialIcons 
                name={expandedSection === 'playerStats' ? 'remove-circle-outline' : 'add-circle-outline'} 
                size={24} 
                color={COLORS.primary} 
              />
            </View>
            
            {expandedSection === 'playerStats' && renderDetailedStats()}
          </TouchableOpacity>
        </View>

        {/* Scrollable Scorecard */}
        <ScrollView 
          horizontal={true} 
          style={styles.scorecardContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scorecardContent}
        >
          <View>
            {/* Column Headers */}
            <View style={styles.headerRow}>
              <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                <Text style={styles.headerText}>HOLE</Text>
              </View>
              {courseData.frontNine.holes.map((hole) => (
                <View key={`hole-${hole}`} style={[styles.holeCell, styles.dataCell, { width: cellSize },{backgroundColor: COLORS.darkGreay}]}>
                  <Text style={styles.holeCellText}>{hole}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>OUT</Text>
              </View>
              {courseData.backNine.holes.map((hole) => (
                <View key={`hole-${hole}`} style={[styles.holeCell, styles.dataCell, { width: cellSize },{backgroundColor: COLORS.darkGreay}]}>
                  <Text style={styles.holeCellText}>{hole}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>IN</Text>
              </View>
              <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 },{backgroundColor: COLORS.darkGreay}]}>
                <Text style={styles.totalCellText}>TOTAL</Text>
              </View>
            </View>

            {/* Par Row */}
            <View style={styles.dataRow}>
              <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                <Text style={styles.headerText}>PAR</Text>
              </View>
              {courseData.frontNine.par.map((par, index) => (
                <View key={`par-front-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                  <Text style={styles.dataCellText}>{par}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>{calculateTotals(courseData.frontNine.par)}</Text>
              </View>
              {courseData.backNine.par.map((par, index) => (
                <View key={`par-back-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                  <Text style={styles.dataCellText}>{par}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>{calculateTotals(courseData.backNine.par)}</Text>
              </View>
              <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>
                  {calculateTotals(courseData.frontNine.par) + calculateTotals(courseData.backNine.par)}
                </Text>
              </View>
            </View>

            {/* Yards Row */}
            <View style={styles.dataRow}>
              <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                <Text style={styles.headerText}>Yard</Text>
              </View>
              {courseData.frontNine.yards.map((yard, index) => (
                <View key={`yard-front-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                  <Text style={styles.dataCellText}>{yard}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>{calculateTotals(courseData.frontNine.yards)}</Text>
              </View>
              {courseData.backNine.yards.map((yard, index) => (
                <View key={`yard-back-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                  <Text style={styles.dataCellText}>{yard}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>{calculateTotals(courseData.backNine.yards)}</Text>
              </View>
              <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>
                  {calculateTotals(courseData.frontNine.yards) + calculateTotals(courseData.backNine.yards)}
                </Text>
              </View>
            </View>

            {/* Index Row */}
            <View style={styles.dataRow}>
              <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                <Text style={styles.headerText}>Index</Text>
              </View>
              {courseData.frontNine.index.map((index, i) => (
                <View key={`index-front-${i}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                  <Text style={styles.dataCellText}>{index}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>{calculateTotals(courseData.frontNine.index)}</Text>
              </View>
              {courseData.backNine.index.map((index, i) => (
                <View key={`index-back-${i}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                  <Text style={styles.dataCellText}>{index}</Text>
                </View>
              ))}
              <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>{calculateTotals(courseData.backNine.index)}</Text>
              </View>
              <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                <Text style={styles.totalCellText}>
                  {calculateTotals(courseData.frontNine.index) + calculateTotals(courseData.backNine.index)}
                </Text>
              </View>
            </View>

            {/* Player Row with Expandable Detail Section */}
            <TouchableOpacity 
              style={styles.playerRowContainer}
              onPress={() => toggleSection('playerScores')}
            >
              <View style={styles.playerRow}>
                <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                 <View style={styles.playerHeaderCell}>
  <MaterialIcons 
    name={expandedSection === 'playerScores' ? 'remove-circle' : 'add-circle'} 
    size={16} // Reduced size
    color="white" 
    style={styles.expansionIcon} // Added specific style
  />
  <Text style={styles.playerName} numberOfLines={2} ellipsizeMode="tail">
    {playerData.name}
  </Text>
</View>
                </View>
               {playerData.scores.front.map((score, index) => (
  <View key={`score-front-${index}`} style={[
    styles.holeCell, 
    styles.dataCell,
    getScoreClass(score, courseData.frontNine.par[index]),
    { width: cellSize }
  ]}>
    <Text style={[
      styles.scoreCellText, 
      { color: getScoreColor(score, courseData.frontNine.par[index]) }
    ]}>
      {score === null ? '-' : score}
    </Text>
  </View>
))}
                <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                  <Text style={styles.totalCellText}>{getFrontNineTotal()}</Text>
                </View>
                {playerData.scores.back.map((score, index) => (
                  <View key={`score-back-${index}`} style={[
                    styles.holeCell, 
                    styles.dataCell,
                    getScoreClass(score, courseData.backNine.par[index]),
                    { width: cellSize }
                  ]}>
                    <Text style={[
                      styles.scoreCellText, 
                      { color: getScoreColor(score, courseData.backNine.par[index]) }
                    ]}>
                      {score}
                    </Text>
                  </View>
                ))}
                <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                  <Text style={styles.totalCellText}>{getBackNineTotal()}</Text>
                </View>
                <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                  <Text style={styles.totalCellText}>{getTotalScore()}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Expandable Details Section */}
            {expandedSection === 'playerScores' && (
              <Animated.View style={{ maxHeight: animatedHeight }}>
                {/* Putts Row */}
                <View style={styles.dataRow}>
                  <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                    <Text style={styles.headerText}>FIR</Text>
                  </View>
                  {playerData.fir.front.map((fir, index) => (
                    <View key={`fir-front-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      {fir ? <MaterialIcons name="check" size={16} color={COLORS.bogey} /> : <Text>-</Text>}
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {((playerData.fir.front.filter(Boolean).length / playerData.fir.front.length) * 100).toFixed(0)}%
                    </Text>
                  </View>
                  {playerData.fir.back.map((fir, index) => (
                    <View key={`fir-back-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      {fir ? <MaterialIcons name="check" size={16} color={COLORS.bogey} /> : <Text>-</Text>}
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {((playerData.fir.back.filter(Boolean).length / playerData.fir.back.length) * 100).toFixed(0)}%
                    </Text>
                  </View>
                  <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {(((playerData.fir.front.filter(Boolean).length + playerData.fir.back.filter(Boolean).length) / 
                      (playerData.fir.front.length + playerData.fir.back.length)) * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>

                {/* REG Row */}
                <View style={styles.dataRow}>
                  <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                    <Text style={styles.headerText}>REG</Text>
                  </View>
                  {playerData.reg.front.map((reg, index) => (
                    <View key={`reg-front-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      {reg ? <MaterialIcons name="check" size={16} color={COLORS.bogey} /> : <Text>-</Text>}
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {((playerData.reg.front.filter(Boolean).length / playerData.reg.front.length) * 100).toFixed(0)}%
                    </Text>
                  </View>
                  {playerData.reg.back.map((reg, index) => (
                    <View key={`reg-back-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      {reg ? <MaterialIcons name="check" size={16} color={COLORS.bogey} /> : <Text>-</Text>}
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {((playerData.reg.back.filter(Boolean).length / playerData.reg.back.length) * 100).toFixed(0)}%
                    </Text>
                  </View>
                  <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {(((playerData.reg.front.filter(Boolean).length + playerData.reg.back.filter(Boolean).length) / 
                      (playerData.reg.front.length + playerData.reg.back.length)) * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>

                {/* Up/Down Row */}
                <View style={styles.dataRow}>
                  <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                    <Text style={styles.headerText}>Up/Down</Text>
                  </View>
                  {playerData.upDown.front.map((upDown, index) => (
                    <View key={`upDown-front-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      {upDown ? <MaterialIcons name="check" size={16} color={COLORS.bogey} /> : <Text>-</Text>}
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {playerData.upDown.front.filter(Boolean).length > 0 ? 
                        ((playerData.upDown.front.filter(Boolean).length / playerData.upDown.front.length) * 100).toFixed(0) + '%' : 
                        '0%'}
                    </Text>
                  </View>
                  {playerData.upDown.back.map((upDown, index) => (
                    <View key={`upDown-back-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      {upDown ? <MaterialIcons name="check" size={16} color={COLORS.bogey} /> : <Text>-</Text>}
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {playerData.upDown.back.filter(Boolean).length > 0 ? 
                        ((playerData.upDown.back.filter(Boolean).length / playerData.upDown.back.length) * 100).toFixed(0) + '%' : 
                        '0%'}
                    </Text>
                  </View>
                  <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {(playerData.upDown.front.filter(Boolean).length + playerData.upDown.back.filter(Boolean).length) > 0 ? 
                        (((playerData.upDown.front.filter(Boolean).length + playerData.upDown.back.filter(Boolean).length) / 
                        (playerData.upDown.front.length + playerData.upDown.back.length)) * 100).toFixed(0) + '%' : 
                        '0%'}
                    </Text>
                  </View>
                </View>

                {/* Penalty Row */}
                <View style={styles.dataRow}>
                  <View style={[styles.holeCell, styles.headerCell, { width: wp(25) }]}>
                    <Text style={styles.headerText}>Penalty</Text>
                  </View>
                  {playerData.penalty.front.map((penalty, index) => (
                    <View key={`penalty-front-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      <Text style={styles.dataCellText}>{penalty}</Text>
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.outTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>{calculateTotals(playerData.penalty.front)}</Text>
                  </View>
                  {playerData.penalty.back.map((penalty, index) => (
                    <View key={`penalty-back-${index}`} style={[styles.holeCell, styles.dataCell, { width: cellSize }]}>
                      <Text style={styles.dataCellText}>{penalty}</Text>
                    </View>
                  ))}
                  <View style={[styles.totalCell, styles.inTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>{calculateTotals(playerData.penalty.back)}</Text>
                  </View>
                  <View style={[styles.totalCell, styles.finalTotalCell, { width: cellSize * 1.5 }]}>
                    <Text style={styles.totalCellText}>
                      {calculateTotals(playerData.penalty.front) + calculateTotals(playerData.penalty.back)}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.eagle }]} />
            <Text style={styles.legendText}>Eagle/Better</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.birdie }]} />
            <Text style={styles.legendText}>Birdie</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.par }]} />
            <Text style={styles.legendText}>Par</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.bogey }]} />
            <Text style={styles.legendText}>Bogey</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.doubleBogey }]} />
            <Text style={styles.legendText}>Double+</Text>
          </View>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/AddScoreScreen')}
        >
          <MaterialIcons name="edit" size={24} color="white" />
          <Text style={styles.actionButtonText}>Continue Scoring</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  courseSummary: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  playerSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
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
  playerInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerHeaderCell: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  paddingRight: 4,
},
expansionIcon: {
  marginRight: 4,
},
playerName: {
  fontSize: 14,
  fontWeight: '600',
  color: '#FFFFFF',
  flex: 1, // allow text to fill available space
},
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  parDifferenceText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  detailedStatsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statsBreakdown: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingTop: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    width: 70,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  scorecardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scorecardContent: {
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: COLORS.primary,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#F8F8F8',
  },
  playerRowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  playerRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  holeCell: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EFEFEF',
    
    
  },
  holeCell1: {
    height: 40,
   
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EFEFEF',
    backgroundColor: '#F8F8F8',
  },
  headerCell: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 8,

    
  },

  dataCell: {
    backgroundColor: '#F8F8F8',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  holeCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dataCellText: {
    fontSize: 14,
    color: '#000000',
  },
  scoreCellText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalCell: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EFEFEF',
  },
  outTotalCell: {
    backgroundColor: COLORS.primary,
  },
  inTotalCell: {
    backgroundColor: COLORS.primary,
  },
  finalTotalCell: {
    backgroundColor: COLORS.primary,
  },
  totalCellText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#000000',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
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
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Score styling for colors
  eagle: {
    backgroundColor: 'rgba(245, 206, 66, 0.2)',
  },
  birdie: {
    backgroundColor: 'rgba(255, 85, 85, 0.2)',
  },
  bogey: {
    backgroundColor: 'rgba(63, 136, 197, 0.2)',
  },
  doubleBogey: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default ScorecardScreen;