import { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView,
  ActivityIndicator, Alert, Keyboard, ImageBackground
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import backgroundImage from './assets/image.png'
import { GoogleGenerativeAI } from "@google/generative-ai";

const statusBarHeight = StatusBar.currentHeight;
const KEY_GEMINI = ("AIzaSyDyEDmHxiph25rNyeR7aQL8YBRVAS362jo");

const genAI = new GoogleGenerativeAI(KEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default function App() {

  const [city, setCity] = useState("");
  const [mood, setMood] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("")

  async function generateTextWithGemini(prompt) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating text with Gemini:", error);
      return "An error occurred.";
    }
  }
  async function handleGenerate() {
    if (city === "") {
      Alert.alert("Atenção", "Preencha o nome do Vocaloid!")
      return;
    }
    if (mood === "") {
      Alert.alert("Atenção", "Preencha o Mood da Música!")
      return;
    }

    setTravel("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `(importante: não use asteriscos. Crie uma lista de recomendações de músicas do gênero Vocaloid, com exatas ${days.toFixed(0)} músicas cantadas pelo vocaloid ${city} e com um mood/vibe ${mood}, limite as músicas apenas ao vocaloid fornecido. Forneça o nome da música, o autor da mesma, ano de lançamento, jogos onde a música está presente e uma breve descrição.`

    const generatedText = await generateTextWithGemini(prompt);
    setTravel(generatedText)
    setLoading(false);

  }

  return (
      <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
      >
        <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#09edc3" />
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#09edc3" />

          <View style={styles.form}>
            <Text style={styles.heading}>Vocaloid</Text>
            <Text style={styles.heading}>Recommender</Text>
            <Text style={styles.label}>Escolha um Vocaloid</Text>
            <TextInput
                placeholder="Ex: Hatsune Miku"
                placeholderTextColor="#808080"
                style={styles.input}
                value={city}
                onChangeText={(text) => setCity(text)}
            />

            <Text style={styles.label}>Selecione um Mood</Text>
            <TextInput
                placeholder="Ex: Fofo"
                placeholderTextColor="#808080"
                style={styles.input}
                value={mood}
                onChangeText={(text) => setMood(text)}
            />

            <Text style={styles.label}>Quantidade de Recomendações: <Text style={styles.days}> {days.toFixed(0)} </Text> músicas</Text>
            <Slider
                minimumValue={1}
                maximumValue={7}
                minimumTrackTintColor="#009688"
                maximumTrackTintColor="#000000"
                value={days}
                onValueChange={(value) => setDays(value)}
            />
          </View>

          <Pressable style={styles.button} onPress={handleGenerate}>
            <Text style={styles.buttonText}>Gerar Músicas</Text>
            <MaterialIcons name="music-note" size={24} color="#FFF" />
          </Pressable>

          <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
            {loading && (
                <View style={styles.content}>
                  <Text style={styles.title}>Carregando recomendações...</Text>
                  <ActivityIndicator color="#000" size="large" />
                </View>
            )}

            {travel && (
                <View style={styles.content}>
                  <Text style={styles.title}>Músicas recomendadas 🎵</Text>
                  <Text style={{ lineHeight: 24, }}>{travel}</Text>
                </View>
            )}
          </ScrollView>

        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54,
    alignSelf: 'center',
    marginTop: -20
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    marginTop: 20
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain', // ou 'contain' dependendo do ajuste que deseja
  },
  days: {
    backgroundColor: '#F1f1f1'
  },
  button: {
    backgroundColor: '#00ddc0',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});