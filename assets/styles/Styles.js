import { StyleSheet } from "react-native";
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
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 0,
    borderWidth: 0,
  },


  cardImage: {
    height: '80',
    width: '80',
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 0,
  },
  cardDetailText: {
    fontSize: 16,
    color: '#000',    
    fontWeight: 'bold',
  },

  ScreenBody:{
    backgroundColor: colorPalette.aliceBlue,
  },

  cardText: {
    paddingHorizontal: 0,
    fontSize: 14,    
    flexWrap: 'wrap'
  },

  fullBlockImage: {
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
