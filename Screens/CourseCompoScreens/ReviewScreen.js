import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useState } from 'react';
import Ratings from '../../Components/CourseComponents/Ratings';
import { Rating } from 'react-native-ratings';
import { SubmitRating } from '../../API_STORE/course_api';
import { useAuth } from '../../Navigation/AuthContext';

export const ReviewScreen = ({ courseData }) => {
  const [showModal, setShowModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const {authUser} = useAuth();

  const handleSubmit = async () => {
    if (stars === 0) {
      alert("Please select a rating!");
      return;
    }

    try {
      console.log({"user": authUser, "rating": stars, "comment": comment})
      const result = await SubmitRating({user: authUser._id, rating: stars, comment: comment}, courseData._id);
      if (result.success) {
        console.log("Rating submitted:", result.data);
        // Optionally update UI
        alert("Thank you for your feedback!");
        // reset + close
        setStars(0);
        setComment("");
        setShowModal(false);
      } else {
        alert("Failed to submit rating: " + result.error);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.textContainer}>
        {/* Row for text + button */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>See what our learners say</Text>
          <TouchableOpacity
            style={styles.rateBtn}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.btnText}>Rate Us</Text>
          </TouchableOpacity>
        </View>

        <Ratings ratings={courseData.ratings} page={"CourseDetailPage"} />
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Rate this Course</Text>

            {/* Star Rating */}
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={30}
              startingValue={stars}
              onFinishRating={(value) => setStars(value)}
              ratingColor="gold"
              style={{ paddingVertical: 15 }}
            />

            {/* Comment Input */}
            <TextInput
              style={styles.commentBox}
              placeholder="Leave a comment..."
              value={comment}
              onChangeText={setComment}
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.rateBtn, { marginTop: 15 }]}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  mainContainer: { padding: 16},
  textContainer: { marginTop: 10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  heading: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  rateBtn: {
    backgroundColor: "#85db51",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600", paddingHorizontal: 5, paddingVertical: 5, textAlign: 'center', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 15 },
  commentBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 15,
  },
});
