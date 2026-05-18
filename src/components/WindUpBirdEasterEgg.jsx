import {
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import windUpBirdImg from '../../Images/WindupBird.jpg'

// TODO: Replace the placeholder below with the passage from The Wind-Up Bird Chronicle (Haruki Murakami)
const WIND_UP_BIRD_QUOTE = `[ The point is, not to resist the flow. You go up when you're supposed to go up and down when you're supposed to go down. When you're supposed to go up, find the highest tower and climb to the top. When you're supposed to go down, find the deepest well and go down to the bottom. When there's no flow, stay still. If you resist the flow, everything dries up. If everything dries up, the world is darkness ]`

function WindUpBirdEasterEgg() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Image
        src={windUpBirdImg}
        alt=""
        boxSize="40px"
        borderRadius="50%"
        objectFit="cover"
        cursor="pointer"
        title="The wind-up bird..."
        ml="auto"
        flexShrink={0}
        onDoubleClick={onOpen}
        _hover={{ opacity: 0.85 }}
        transition="opacity 0.2s"
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="gray.50"
          borderRadius="12px"
          boxShadow="lg"
          maxW="400px"
          mx={4}
        >
          <ModalCloseButton color="gray.500" />
          <ModalBody py={8} px={6}>
            {/* QUOTE_PLACEHOLDER: Jorge will insert the Murakami quote here */}
            <Text
              fontStyle="italic"
              lineHeight="1.8"
              fontSize="md"
              color="gray.700"
            >
              {WIND_UP_BIRD_QUOTE}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WindUpBirdEasterEgg
