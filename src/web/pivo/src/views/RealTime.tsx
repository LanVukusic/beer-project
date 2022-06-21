import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FaRegClock,
  FaLink,
  FaWaveSquare,
  FaHeart,
  FaHeartBroken,
} from "react-icons/fa";

import { IHistory, useHistory, useSensor } from "../services/Sensor";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

interface IProps {
  history: IHistory[];
}

export const Graph = ({ history }: IProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={history}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <Line
          type="basis"
          dataKey="value"
          stroke="#ecc94b"
          strokeWidth={4}
          isAnimationActive={false}
        />
        <CartesianGrid stroke="#ccc" opacity={0.4} />
        <YAxis scale="auto" type="number" domain={[68, 72]} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const RealTime = () => {
  const { addData, data: hist } = useHistory(15);
  const [id, setId] = useState(0);
  let chartKey = 0;

  const cb = (d: IHistory) => {
    addData(d);
    chartKey++;
    setId(id + 1);
  };

  // sensor connection
  const { connect, disconnect, isConnected, data, isError, isLoading, i } =
    useSensor<number>(cb);

  // inputs
  const [inputs, setInputs] = useState({
    url: "",
    interval: "2000",
  });

  return (
    <Container maxW="6xl" w="full" py={8}>
      <Stack spacing={16}>
        <Flex align="center">
          <Heading color="blackAlpha.600" px={4}>
            <FaRegClock />
          </Heading>
          <Heading color="blackAlpha.700">Real Time</Heading>
        </Flex>
        {/* connect to a sensor */}
        <Stack>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaWaveSquare opacity={0.7} />}
            />

            <Input
              value={inputs.interval}
              onChange={(e) =>
                setInputs({ ...inputs, interval: e.target.value })
              }
              type="number"
              placeholder="polling rate [ms]"
              disabled={isConnected}
            />
          </InputGroup>

          <Flex>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<FaLink opacity={0.7} />}
              />
              <Input
                value={inputs.url}
                onChange={(e) => setInputs({ ...inputs, url: e.target.value })}
                type="url"
                placeholder="sensor hostname"
                disabled={isConnected}
              />
            </InputGroup>
            <Button
              mx={4}
              colorScheme="yellow"
              isLoading={isLoading}
              onClick={() => {
                if (!isConnected) {
                  connect(inputs.url, parseInt(inputs.interval));
                } else {
                  disconnect();
                }
              }}
            >
              {isConnected ? "disconnect" : "connect"}
            </Button>
          </Flex>

          {isError && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Povezava je padla!</AlertTitle>
              <AlertDescription>
                Poglej če je senzor na omrežju
              </AlertDescription>
            </Alert>
          )}
        </Stack>
        {/* Display connectivity state */}
        <Flex direction="row" justifyContent="space-around">
          <Flex align="center" justifyContent="flex-start">
            <Flex p={0}>
              {isConnected ? (
                <FaHeart
                  fontSize="120%"
                  color="red"
                  opacity={i % 2 == 0 ? 0.6 : 0.2}
                />
              ) : (
                <FaHeartBroken fontSize="120%" color="black" opacity={0.5} />
              )}
            </Flex>
            <StatGroup>
              <Stat p={4}>
                <StatLabel>Status</StatLabel>
                <StatNumber>
                  {isConnected ? (
                    <Text color="green.500">Connected</Text>
                  ) : (
                    <Text color="red.500">Disconnected</Text>
                  )}
                </StatNumber>
              </Stat>
            </StatGroup>
          </Flex>
          <StatGroup>
            <Stat p={4}>
              <StatLabel>Meritev:</StatLabel>
              <StatNumber>{data}</StatNumber>
              <StatHelpText>
                {hist.length > 1 && (
                  <Box>
                    <StatArrow
                      type={
                        hist[hist.length - 1].value -
                          hist[hist.length - 2].value >
                        0
                          ? "increase"
                          : "decrease"
                      }
                    />
                    {Math.round(
                      Math.abs(
                        hist[hist.length - 1].value -
                          hist[hist.length - 2].value
                      ) * 100
                    ) / 100}
                  </Box>
                )}
              </StatHelpText>
            </Stat>
          </StatGroup>
        </Flex>
        {/* display the data */}
        <Box w="full" h="50vh">
          <Graph history={hist} key={chartKey}></Graph>
        </Box>
      </Stack>
    </Container>
  );
};
