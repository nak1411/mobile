import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default function WarriorBookScreen({ navigation }) {
  const { colors, typography, spacing, borderRadius, shadows, isDark } =
    useTheme();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Biblical verses organized by life struggles
  const warriorBookData = {
    "Fear / Courage": {
      color: colors.emergency[500],
      verses: [
        {
          reference: "Proverbs 29:25 ESV",
          text: "The fear of man lays a snare, but whoever trusts in the Lord is safe.",
        },
        {
          reference: "2 Timothy 1:7 ESV",
          text: "For God gave us a spirit not of fear but of power and love and self-control.",
        },
        {
          reference: "Deuteronomy 3:22 ESV",
          text: "You shall not fear them, for it is the Lord your God who fights for you.",
        },
        {
          reference: "Psalm 31:24 ESV",
          text: "Be strong, and let your heart take courage, all you who wait for the Lord!",
        },
        {
          reference: "Isaiah 41:10 ESV",
          text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.",
        },
        {
          reference: "Isaiah 12:2 ESV",
          text: "Behold, God is my salvation; I will trust, and will not be afraid; for the Lord God is my strength and my song, and he has become my salvation.",
        },
      ],
    },
    "Pride / Humility": {
      color: colors.warrior[500],
      verses: [
        {
          reference: "Proverbs 16:18 ESV",
          text: "Pride goes before destruction, and a haughty spirit before a fall",
        },
        {
          reference: "Jeremiah 9:23 ESV",
          text: "Thus says the Lord: 'Let not the wise man boast in his wisdom, let not the mighty man boast in his might, let not the rich man boast in his riches,'",
        },
        {
          reference: "Isaiah 5:21 ESV",
          text: "Woe to those who are wise in their own eyes, and shrewd in their own sight!",
        },
        {
          reference: "James 4:6 ESV",
          text: "God opposes the proud but gives grace to the humble.",
        },
        {
          reference: "Psalm 25:9 ESV",
          text: "He leads the humble in what is right, and teaches the humble his way.",
        },
        {
          reference: "James 4:10 ESV",
          text: "Humble yourselves before the Lord, and he will exalt you.",
        },
      ],
    },
    "Anger / Love": {
      color: colors.emergency[600],
      verses: [
        {
          reference: "James 1:20 ESV",
          text: "For the anger of man does not produce the righteousness of God.",
        },
        {
          reference: "Psalm 37:8 ESV",
          text: "Refrain from anger, and forsake wrath! Fret not yourself; it tends only to evil.",
        },
        {
          reference: "Ecclesiastes 7:9 ESV",
          text: "Be not quick in your spirit to become angry, for anger lodges in the heart of fools.",
        },
        {
          reference: "1 Corinthians 13:4-8 ESV",
          text: "Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful; it does not rejoice at wrongdoing, but rejoices with the truth. Love bears all things, believes all things, hopes all things, endures all things. Love never ends.",
        },
        {
          reference: "1 Peter 4:8 ESV",
          text: "Above all, keep loving one another earnestly, since love covers a multitude of sins.",
        },
        {
          reference: "1 Corinthians 16:14 ESV",
          text: "Let all that you do be done in love.",
        },
      ],
    },
    "Lust / Purity": {
      color: colors.success[500],
      verses: [
        {
          reference: "Matthew 5:28 ESV",
          text: "But I say to you that everyone who looks at a woman/man with lustful intent has already committed adultery with her/him in his heart.",
        },
        {
          reference: "Ephesians 5:3 ESV",
          text: "But sexual immorality and all impurity or covetousness must not even be named among you, as is proper among saints.",
        },
        {
          reference: "1 Corinthians 6:18 ESV",
          text: "Flee from sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body.",
        },
        {
          reference: "Psalm 51:10 ESV",
          text: "Create in me a clean heart, O God, and renew a right spirit within me.",
        },
        {
          reference: "Matthew 5:8 ESV",
          text: "Blessed are the pure in heart, for they shall see God.",
        },
        {
          reference: "Romans 13:14 ESV",
          text: "But put on the Lord Jesus Christ, and make no provision for the flesh, to gratify its desires.",
        },
      ],
    },
    "Discouragement / Hope": {
      color: colors.warning[500],
      verses: [
        {
          reference: "Psalm 42:5 ESV",
          text: "Why are you cast down, O my soul, and why are you in turmoil within me? Hope in God; for I shall again praise him, my salvation",
        },
        {
          reference: "2 Corinthians 4:8 ESV",
          text: "We are afflicted in every way, but not crushed; perplexed, but not driven to despair;",
        },
        {
          reference: "Psalm 34:18 ESV",
          text: "The Lord is near to the brokenhearted and saves the crushed in spirit.",
        },
        {
          reference: "Jeremiah 29:11 ESV",
          text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
        },
        {
          reference: "Romans 15:13 ESV",
          text: "May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.",
        },
        {
          reference: "Isaiah 40:31 ESV",
          text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
        },
      ],
    },
    "Doubt / Faith": {
      color: colors.primary[500],
      verses: [
        {
          reference: "Hebrews 3:12 ESV",
          text: "Take care, brothers, lest there be in any of you an evil, unbelieving heart, leading you to fall away from the living God.",
        },
        {
          reference: "James 1:6 ESV",
          text: "But let him ask in faith, with no doubting, for the one who doubts is like a wave of the sea that is driven and tossed by the wind.",
        },
        {
          reference: "Hebrews 3:8 ESV",
          text: "Do not harden your hearts as in the rebellion, on the day of testing in the wilderness,",
        },
        {
          reference: "2 Corinthians 5:7 ESV",
          text: "For we walk by faith, not by sight.",
        },
        {
          reference: "1 Corinthians 16:13 ESV",
          text: "Be watchful, stand firm in the faith, act like men, be strong.",
        },
        {
          reference: "Romans 1:17 ESV",
          text: "For in it the righteousness of God is revealed from faith for faith, as it is written, 'The righteous shall live by faith.'",
        },
      ],
    },
  };

  // Filter categories based on search
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredCategories(Object.keys(warriorBookData));
    } else {
      const filtered = Object.keys(warriorBookData).filter(
        (category) =>
          category.toLowerCase().includes(searchText.toLowerCase()) ||
          warriorBookData[category].verses.some(
            (verse) =>
              verse.text.toLowerCase().includes(searchText.toLowerCase()) ||
              verse.reference.toLowerCase().includes(searchText.toLowerCase())
          )
      );
      setFilteredCategories(filtered);
    }
  }, [searchText]);

  useEffect(() => {
    setFilteredCategories(Object.keys(warriorBookData));
  }, []);

  // Handle category selection
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  // Back button handler
  const backPressed = () => {
    navigation.navigate("Home");
  };

  // Dynamic styles based on current theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
      paddingTop: StatusBar.currentHeight || 0,
    },

    header: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[6],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
      backgroundColor: colors.background.glassDark,
    },

    titleContainer: {
      alignItems: "center",
    },

    title: {
      color: colors.text.primary,
      fontWeight: typography.fontWeights.bold,
      fontSize:
        width < 360 ? typography.fontSizes["3xl"] : typography.fontSizes["4xl"],
      marginBottom: spacing[2],
      textAlign: "center",
      textShadowColor: isDark ? "rgba(0, 0, 0, 0.5)" : "transparent",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },

    subtitle: {
      color: colors.text.secondary,
      fontSize: typography.fontSizes.base,
      textAlign: "center",
      fontWeight: typography.fontWeights.medium,
    },

    searchContainer: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[4],
      backgroundColor: colors.background.glassDark,
    },

    searchInput: {
      backgroundColor: colors.background.glassMedium,
      borderColor: colors.border.light,
      color: colors.text.primary,
      fontSize: typography.fontSizes.base,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },

    content: {
      flex: 1,
      paddingHorizontal: spacing[3],
    },

    categoriesList: {
      paddingBottom: spacing[6],
    },

    categoryCard: {
      backgroundColor: colors.background.card,
      marginHorizontal: spacing[3],
      marginVertical: spacing[2],
      borderRadius: borderRadius.md,
      padding: spacing[4],
      borderLeftWidth: 4,
      ...shadows.md,
      borderWidth: 1,
      borderColor: colors.border.light,
    },

    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
    },

    categoryIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing[4],
      ...shadows.sm,
    },

    categoryIcon: {
      fontSize: typography.fontSizes["2xl"],
    },

    categoryInfo: {
      flex: 1,
    },

    categoryTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.text.primary,
      marginBottom: spacing[1],
    },

    categorySubtitle: {
      fontSize: typography.fontSizes.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeights.medium,
    },

    categoryArrow: {
      fontSize: typography.fontSizes["2xl"],
      color: colors.text.secondary,
    },

    bottomSection: {
      padding: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: height > 800 ? spacing[12] : spacing[8],
    },

    backButton: {
      backgroundColor: colors.background.glassMedium,
      borderWidth: 1,
      borderColor: colors.border.light,
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[8],
      borderRadius: borderRadius.md,
      alignItems: "center",
      ...shadows.base,
    },

    backButtonText: {
      color: colors.text.primary,
      fontSize:
        width < 360 ? typography.fontSizes.sm : typography.fontSizes.base,
      fontWeight: typography.fontWeights.semibold,
      letterSpacing: typography.letterSpacing.wide,
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      justifyContent: "flex-end",
    },

    modalContent: {
      backgroundColor: colors.background.card,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      maxHeight: "85%",
      minHeight: "60%",
      ...shadows.xl,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[6],
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },

    modalTitleContainer: {
      flex: 1,
    },

    modalTitle: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.text.primary,
      flex: 1,
    },

    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
      ...shadows.sm,
    },

    closeButtonText: {
      fontSize: typography.fontSizes.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeights.bold,
    },

    versesList: {
      padding: spacing[6],
    },

    verseCard: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.md,
      padding: spacing[4],
      marginBottom: spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: colors.warrior[500],
      ...shadows.sm,
    },

    verseReference: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold,
      color: colors.warrior[600],
      marginBottom: spacing[2],
    },

    verseText: {
      fontSize: typography.fontSizes.base,
      lineHeight: typography.lineHeights.normal,
      color: colors.text.primary,
      fontStyle: "italic",
      fontWeight: typography.fontWeights.normal,
    },
  });

  // Render category item
  const renderCategoryItem = ({ item }) => {
    const categoryData = warriorBookData[item];
    return (
      <TouchableOpacity
        style={[styles.categoryCard, { borderLeftColor: categoryData.color }]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{item}</Text>
            <Text style={styles.categorySubtitle}>
              {categoryData.verses.length} verses available
            </Text>
          </View>
          <Text style={styles.categoryArrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render verse item in modal
  const renderVerseItem = ({ item }) => (
    <View style={styles.verseCard}>
      <Text style={styles.verseReference}>{item.reference}</Text>
      <Text style={styles.verseText}>"{item.text}"</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.dark}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Warrior Book</Text>
          <Text style={styles.subtitle}>
            Biblical verses for life's battles
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search struggles or verses..."
          placeholderTextColor={colors.text.placeholder}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Categories List */}
      <View style={styles.content}>
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Back Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.backButton} onPress={backPressed}>
          <Text style={styles.backButtonText}>BACK TO HOME</Text>
        </TouchableOpacity>
      </View>

      {/* Verses Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{selectedCategory}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedCategory && (
              <FlatList
                data={warriorBookData[selectedCategory]?.verses || []}
                renderItem={renderVerseItem}
                keyExtractor={(item, index) => `${selectedCategory}-${index}`}
                contentContainerStyle={styles.versesList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}