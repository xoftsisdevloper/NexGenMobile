import { LogBox, StyleSheet } from "react-native";
import { colorPalette } from "./Colors";

export const CourseCardStyle = StyleSheet.create({

  cardContainer: {
    marginVertical: 0,
    marginHorizontal: 5,
    padding: 5,
    paddingBottom: 0,
    borderRadius: 10,
    width: '130',
    height: '150',
    elevation: 0,
    borderWidth: 0,
  },


  cardImage: {
    height: '80',
    width: '100%',
    borderRadius: 10,
    backgroundColor: colorPalette.lightGray,
    resizeMode: 'center',
    zIndex: -1
  },
  cardContent: {
    padding: 5,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 0,
  },
  cardDetailText: {
    fontSize: 14,
    color: '#000',    
    fontWeight: 'bold',
    marginVertical: 10,
  },

  ScreenBody:{
    backgroundColor: colorPalette.aliceBlue,
  },

  cardDescription: {
    display: 'none'
  }
});

export const CourseCardFullBlock = StyleSheet.create({

  cardContainer: {
    marginHorizontal: 0,
    padding: 10,
    borderRadius: 10,
    elevation: 0,
    borderWidth: 0,
  },

  cardImage: {
    height: '80',
    width: '100',
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: colorPalette.lightGray,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 10,
    gap: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 0,
    textTransform: 'capitalize',
  },
  cardDetailText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },

  ScreenBody: {
    backgroundColor: colorPalette.aliceBlue,
  },

  cardText: {
    paddingHorizontal: 0,
    fontSize: 12,
    flexWrap: 'wrap',
  },

  fullBlockImage: {
    alignSelf: 'center',
  },

  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },

  courseTypeTag: {
    backgroundColor: colorPalette.transBlue,
    width: '30%',
    height: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  courseTypeText: {
    color: colorPalette.textgreen,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  newTag: {
    backgroundColor: colorPalette.aliceBlue,
    position: 'absolute',
    width: '50%',
    height: 30,
    borderLeftColor: 'transparent',
    zIndex: 1,
    top: -10,
    right: -10,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
  },

  newText: {
    position: 'absolute',
    color: colorPalette.blue,
    fontWeight: 'bold',
    fontSize: 12,
    zIndex: 2,
    right: 0,
    top: -4,
  },

});

export const homeStyle = StyleSheet.create({
  screenBg: {
    flex: 1,
  },

  courseFlex: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0147ab'
  }
});

export const loginBeforeScreenstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginTypeBlocks: {
    width: 200,
    height: 'auto',
    backgroundColor: colorPalette.blue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 5,
    shadowColor: colorPalette.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: colorPalette.electricBlue,
    overflow: 'hidden',
    cursor: 'pointer',
  },

  outerBox: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 20,
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  LogoBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 150,
    resizeMode: 'contain',
    height: 150,
  },

  teacherImg: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorPalette.white,
    width: '100%',
    textAlign: 'center',
  },

  innerBox: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
})
