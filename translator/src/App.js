import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import translate from "translate";
import "./App.css";
import { ChakraProvider, Box, HStack, VStack, Button, Image, Heading, Select, Text, Card, CardBody, CardFooter, CardHeader, Divider, Center } from '@chakra-ui/react'
function App() {
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const [transatedText, setTranslatedText] = useState('');

    // const [continuous, setContinuous] = useState(true);

    const handleDropdownChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleListening = () => {
        // console.log(continuous);
        resetTranscript();
        setIsListening(true);
        // SpeechRecognition.abortListening();
        SpeechRecognition.startListening({
            continuous: false,
        });
    };

    // const handleContinuous = (e)=> {
    //     console.log(continuous)
    //     setContinuous(e.target.checked);
    // }

    const handleStop = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
        console.log("User Input: ", transcript);
        const languageCode = selectedLanguage.substring(0, 2);
        translate(transcript, { from: "en", to: languageCode })
            .then((text) => {
                console.log("Translated Text: ", text);
                setTranslatedText(text);
                const speech = new SpeechSynthesisUtterance();
                speech.lang = selectedLanguage;
                speech.text = text;
                window.speechSynthesis.speak(speech);
                
            })
            .catch((err) => {
                console.log(err);
                resetTranscript();
            });
    };

    return (
        <ChakraProvider>
            <Box className="App" maxW='full'>
                <VStack m={10} spacing={10}>
                    <HStack>
                        <Image src='/cubes.gif' w={40}></Image>
                        <Heading>Commune Instant Translator</Heading>
                    </HStack>
                    {!SpeechRecognition.browserSupportsSpeechRecognition() && 
                        <Heading>Browser does not support Speech Recognition.</Heading>
                    }
                    <HStack >
                        <Card align='center'>
                            <CardHeader>
                                <Heading size='md'>Select your target language</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack>
                                <Select
                                    borderColor='tomato'
                                    color='white'
                                    placeholder='Target language'
                                    bg='tomato'
                                    value={selectedLanguage} onChange={handleDropdownChange}
                                    sx={{'> option': {background: '#2C5282'}}}>
                                    <option value="en-US" defaultValue>
                                        English
                                    </option>
                                    <option value="es-ES" className="Options">
                                        Spanish
                                    </option>
                                    <option value="fr-FR" className="Options">
                                        French
                                    </option>
                                </Select>
                                {/* <Checkbox
                                onChange={handleContinuous}
                                >Continuous Recognition</Checkbox> */}
                                <Center height='50px'>
                                    <Divider orientation='horizontal' />
                                </Center>
                                <Center><Text>{transatedText}</Text></Center>
                                </VStack>
                            </CardBody>
                            <CardFooter>
                                {!isListening &&
                                    <Button colorScheme='green' onClick={handleListening}>Click to Speak</Button>
                                }
                                {isListening &&
                                    <Button colorScheme='blue' onClick={handleStop}>Listen your voice</Button>
                                }
                            </CardFooter>
                        </Card>
                    </HStack>
                </VStack>
            </Box>
        </ChakraProvider>
    );
}

export default App;
