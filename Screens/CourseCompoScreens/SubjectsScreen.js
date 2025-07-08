import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { colorPalette } from '../../assets/styles/Colors';
import { useAuth } from '../../Navigation/AuthContext';
const courseDatas = [
  {
    "_id": "68368a1576cefc6313e80ce8",
    "name": "MindGym Toddler -1",
    "description": "\u003Cp\u003E\u003Cstrong\u003EMindGym \u003C/strong\u003Erefers to the art and science of learning. It includes methods, strategies, and approaches used by educators to facilitate learning.\u003C/p\u003E\u003Cp\u003EMindgym is not just about memorize but also about how it is memorized.\u003C/p\u003E",
    "duration": 5,
    "status": "active",
    "imageUrl": "data:image/jpeg;base64,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",
    "course_type": "school",
    "course_institution": null,
    "join_code": "MINDGYMTODDLER1-MB8PTHUA",
    "subjects": [
      {
        "_id": "68368a1676cefc6313e80cec1",
        "name": "English Grammer Rhymes",
        "description": "\u003Cp\u003EThis content has all the grammer in english in the rhyming format\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683957d996feeee945199a7d",
            "name": "The Noun Rhyme",
            "description": "“The Noun’s Rhyme” explores the rhythmic beauty and playful harmony of English nouns that echo in sound.",
            "content_type": "Video",
            "subject_id": "68368a1676cefc6313e80cec",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/MindGym%20Toddler-%20-%201%20(3).mp4",
            "createdAt": "2025-05-30T07:01:45.661Z",
            "updatedAt": "2025-06-03T17:55:39.237Z",
            "__v": 0
          },
          {
            "_id": "683957d996feeee945199a7f",
            "name": "The Adjective Rhyme",
            "description": "“The Adjective Rhyme” explores the rhythmic beauty and playful harmony of English Adjectives that echo in sound.",
            "content_type": "Video",
            "subject_id": "68368a1676cefc6313e80cec",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/Adjectives_rhyme.mp4",
            "createdAt": "2025-05-30T07:01:45.818Z",
            "updatedAt": "2025-06-03T17:55:39.384Z",
            "__v": 0
          },
          {
            "_id": "683957d996feeee945199a81",
            "name": "The Adverb Rhyme",
            "description": "“The Adverb’s Rhyme” explores the rhythmic beauty and playful harmony of English adverbs that echo in sound.",
            "content_type": "Video",
            "subject_id": "68368a1676cefc6313e80cec",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/Adverb_rhyme.mp4",
            "createdAt": "2025-05-30T07:01:45.966Z",
            "updatedAt": "2025-06-03T17:55:39.532Z",
            "__v": 0
          },
          {
            "_id": "6839969f96feeee945199b97",
            "name": "The Conjuction Rhyme",
            "description": "“The Conjuction's Rhyme” explores the rhythmic beauty and playful harmony of English Conjuction that echo in sound.",
            "content_type": "Video",
            "subject_id": "68368a1676cefc6313e80cec",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/Conjuction_song.mp4",
            "createdAt": "2025-05-30T11:29:35.151Z",
            "updatedAt": "2025-06-03T17:55:39.679Z",
            "__v": 0
          }
        ],
        "duration": 13,
        "status": "active",
        "createdAt": "2025-05-28T03:59:18.167Z",
        "updatedAt": "2025-06-03T17:55:39.829Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d62",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d61",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d63",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d64",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d65",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d66",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d67",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d68",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d69",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d69",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d60",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d611",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d612",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d613",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      },
      {
        "_id": "683f370baf9c3786ec4158d615",
        "name": "SCIENCE RHYMES",
        "description": "\u003Cp\u003E\u003Cstrong\u003ENexgen’s MindGym Toddler - 1\u003C/strong\u003E presents \u003Cstrong\u003EScience Rhymes\u003C/strong\u003E, a playful way to introduce young minds to science through fun, engaging rhymes that spark curiosity and early learning joy.\u003C/p\u003E",
        "course_id": "68368a1576cefc6313e80ce8",
        "materials": [
          {
            "_id": "683f370baf9c3786ec4158ce",
            "name": "Human Body and Senses - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Human Body and Senses with fun, simple rhymes that help toddlers explore body parts and their five senses through engaging, early science learning.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/HumanBodySense.mp4",
            "createdAt": "2025-06-03T17:55:23.269Z",
            "updatedAt": "2025-06-03T17:55:39.977Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d0",
            "name": "HUMAN BODY - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 explores the Human Body through fun rhymes and visuals, helping toddlers learn about body parts, movement, and functions in a playful, memorable way.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/humaonBody.mp4",
            "createdAt": "2025-06-03T17:55:23.417Z",
            "updatedAt": "2025-06-03T17:55:40.125Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d2",
            "name": " Animals and Their Habitats - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 introduces Animals and Their Habitats with engaging rhymes that teach toddlers where animals live—like forests, oceans, and deserts—sparking curiosity about nature and wildlife.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/_Animals%20and%20Their%20Habitats.mp4",
            "createdAt": "2025-06-03T17:55:23.564Z",
            "updatedAt": "2025-06-03T17:55:40.272Z",
            "__v": 0
          },
          {
            "_id": "683f370baf9c3786ec4158d4",
            "name": " Earth and Sky - Rhyme",
            "description": "Nexgen’s MindGym Toddler - 1 presents Earth and Sky with delightful rhymes that help toddlers discover the wonders of land, water, sun, moon, and stars—nurturing early awareness of our world.",
            "content_type": "Video",
            "content_url": "https://pub-e50998d289a9436f8eeba567c32a4be5.r2.dev/earthandSky.mp4",
            "createdAt": "2025-06-03T17:55:23.712Z",
            "updatedAt": "2025-06-03T17:55:40.420Z",
            "__v": 0
          }
        ],
        "duration": 5,
        "status": "active",
        "createdAt": "2025-06-03T17:55:23.861Z",
        "updatedAt": "2025-06-03T17:55:40.568Z",
        "__v": 0
      }
    ],
    "created_by": "683677d276cefc6313e80b6e",
    "joinRequests": [
      {
        "user": {
          "_id": "683678d076cefc6313e80bf8",
          "username": "Abu Talib",
          "email": "abutalib07022002@gmail.com",
          "password": "$2b$10$cJF1FGkMImGOAQaGyY8CvuvXLopw.b4cN6yQhfMFRMq9dMeQcmW9K",
          "isAdmin": false,
          "isActive": true,
          "isApproved": true,
          "groups": [],
          "profilePicture": null,
          "role": "student",
          "lastLogin": null,
          "institution": "68399a8196feeee945199ba1",
          "phoneNumber": 9677082133,
          "educationLevel": "college",
          "schoolClass": "",
          "collegeDegree": "bca",
          "customCollegeDegree": null,
          "experience": null,
          "expertise": "",
          "courses": [],
          "createdAt": "2025-05-28T02:45:36.307Z",
          "updatedAt": "2025-05-31T05:51:39.798Z",
          "__v": 0
        },
        "status": "approved",
        "_id": "683f3a50af9c3786ec415912",
        "requestedAt": "2025-06-03T18:09:20.038Z"
      }
    ],
    "ratings": [],
    "progress": [],
    "createdAt": "2025-05-28T03:59:17.860Z",
    "updatedAt": "2025-06-03T18:10:13.909Z",
    "__v": 2
  },
]
export const SubjectsScreen = ({ courseData }) => {
  const navigation = useNavigation();
  const { authUser } = useAuth();

  const renderSubject = (item, index) => (
    <View style={styles.subjectContainer} key={item.name}>
      <TouchableOpacity
        onPress={() =>
          authUser?.role === 'student'
            ? navigation.navigate('LessonHub', { itemDetails: item })
            : navigation.navigate('TeacherLessonHub', { itemDetails: item })
        }
        style={styles.unitList}
      >
        <View
          style={[
            styles.chapterBox,
            { backgroundColor: colorPalette.blue },
          ]}
        >
          <Text style={styles.lesson}>L{index + 1}</Text>
        </View>
        <View style={styles.subjectNameContainer}>
          <Text style={styles.unitItem}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={courseData?.subjects ?? []}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => renderSubject(item, index)}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const { height: deviceHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContentContainer: {
    padding: 20,
    paddingBottom: 40,
    minHeight: deviceHeight,
  },
  subjectContainer: {
    marginBottom: 12,
  },
  unitList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorPalette.aliceBlue,
    borderRadius: 5,
    minHeight: 50,
  },
  chapterBox: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1%',
    borderRadius: '50%', // Use a fixed value for perfect circle up to 1000
  },
  lesson: {
    color: colorPalette.white,
    fontSize: 16,
    fontWeight: '700',
  },
  subjectNameContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  unitItem: {
    fontSize: 16,
    lineHeight: 22,
    textTransform: 'capitalize',
  },
});

export default SubjectsScreen;
