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

const WIND_UP_BIRD_QUOTE = '[ Insert quote here ]'

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
