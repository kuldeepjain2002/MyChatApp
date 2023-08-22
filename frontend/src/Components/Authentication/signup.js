import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
// import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
// import { useHistory } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Warning",
        description: "Please select an image",
        status: "warning",
        duration: 6000,
        isClosable: true,
      });
      return;
    }
    if (pics.type === "image/png" || pics.type === "image/jpeg") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mernchat-app");
      data.append("cloud_name", "dowsu48pk");
      fetch("https://api.cloudinary.com/v1_1/dowsu48pk/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Warning",
        description: "Please select an image",
        status: "warning",
        duration: 6000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Warning",
        description: "Fill all the fields",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Warning",
        description: "Password didn't match",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    console.log(name, email, password, pic);
    // const c

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // console.log("config done");
      // console.log(name, email, password, pic);
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      console.log("data::::");
      console.log(data);
      toast({
        title: "Registration Successful",
        // description: "Password didn't match",
        status: "success",
        duration: 6000,
        isClosable: true,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chat");
    } catch (error) {
      toast({
        title: "Error Occured ",
        description: error.response.data.message,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
