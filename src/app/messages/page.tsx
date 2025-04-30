"use client";

import React, { useState, useEffect } from "react";
import { AlignJustify, ChevronRight } from "lucide-react";
import styles from "./messages.module.css";
import { useRouter } from "next/navigation";
import {
  Table,
  Thead,
  Tbody,
  Stack,
  Divider,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
  Menu,
  MenuButton,
  Image,
  MenuList,
  MenuItem,
  Flex,
  Avatar,
  Checkbox,
  Button,
  Box,
  Tfoot,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BrowserView, MobileView } from "react-device-detect";
import MessagePopUp from "@/components/MessagePopUp";

function Messages() {
  const messagesPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inbox");
  const [isClient, setIsClient] = useState(false);
  const [openMessagePopUp, setOpenMessagePopUp] = useState(false);
  const [messageProps, setMessageProps] = useState({
    date: "",
    adminName: "",
    messageContent: "",
    messageTitle: "",
    id: -1,
  });
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null);
  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const unreadCount = messages.length;

  useEffect(() => {
    setIsClient(true);
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleSelect = (id: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, selected: !msg.selected } : msg)),
    );
  };

  return (
    <div>
      {isClient ? (
        <>
          <BrowserView>
            <div className={styles.container}>
              <h2 className={styles.header}>Messages</h2>
              <p className={styles.unread}>
                {unreadCount} unread {unreadCount === 1 ? "announcement" : "announcements"}
              </p>

              <div className={styles.topBar}>
                <div className={styles.tabContainer}>
                  <button
                    className={`${styles.tab} ${activeTab === "inbox" ? styles.activeTab : ""}`}
                    onClick={() => {
                      setActiveTab("inbox");
                      setCurrentPage(1);
                    }}
                  >
                    Inbox
                  </button>
                  <button
                    className={`${styles.tab} ${activeTab === "sent" ? styles.activeTab : ""}`}
                    onClick={() => {
                      setActiveTab("sent");
                      setCurrentPage(1);
                    }}
                  >
                    Sent
                  </button>
                </div>
                <button className={styles.newMessageButton} onClick={() => router.push("/createAnnouncement")}>
                  New Message +
                </button>{" "}
              </div>

              {activeTab === "inbox" ? (
<<<<<<< HEAD
                <div>
                  <Flex>
                    <Table className={styles.table}>
                      <Thead className={styles.tableHeader}>
                        <Tr className={styles.tableHeader}>
                          <Th>Select</Th>
                          <Th>Sender</Th>
                          <Th>Subject Line</Th>
                          <Th>Date</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {currentMessages.map((msg) => (
                          <Tr key={msg._id} className={styles.clickableRow}>
                            <Td>
                              <Checkbox isChecked={msg.selected} onChange={() => toggleSelect(msg.id)} />
                            </Td>
                            <Td
                              className={`${msg.selected ? styles.fadedText : ""}`}
                              onClick={() => setSelectedMessage(msg)}
                            >
                              <Flex className={styles.avatarContainer}>
                                <Avatar name={msg.sender} size="sm" bg="#596334" color="white" />
                                {msg.from}
                              </Flex>
                            </Td>
                            <Td className={msg.selected ? styles.fadedText : ""}>{msg.subject}</Td>
                            <Td className={msg.selected ? styles.fadedText : ""}>
                              {new Date(msg.time).toLocaleDateString()}
                            </Td>
                            <Td>
                              <ChevronRight
                                onClick={() => {
                                  setOpenMessagePopUp(!openMessagePopUp);
                                  setMessageProps({
                                    date: new Date(msg.time).toLocaleDateString(),
                                    adminName: msg.from,
                                    messageContent: msg.message,
                                    messageTitle: msg.subject,
                                    id: msg._id,
                                  });
                                }}
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>

                      {/* Page Controls */}
                      <Tfoot>
                        <Tr>
                          <Td colSpan={5}>
                            <Box className={styles.pageControls}>
                              <Button
                                className={styles.pageButton}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                Previous
                              </Button>

                              {Array.from({ length: totalPages }, (_, index) => (
                                <Button
                                  key={index + 1}
                                  className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
                                  onClick={() => handlePageChange(index + 1)}
                                >
                                  {index + 1}
                                </Button>
                              ))}

                              <Button
                                className={styles.pageButton}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </Button>
                            </Box>
                          </Td>
                        </Tr>
                      </Tfoot>
                    </Table>
                    {openMessagePopUp === true ? (
                      <MessagePopUp
                        date={messageProps.date}
                        messageTitle={messageProps.messageTitle}
                        adminName={messageProps.adminName}
                        messageContent={messageProps.messageContent}
                        id={messageProps.id}
                      />
                    ) : (
                      <></>
                    )}
                  </Flex>
                </div>
=======
                <>
                  <Box height="41rem">
                    <Table className={styles.table}>
                      <Thead>
                        <Tr>
                          <Th>Select</Th>
                          <Th>Sender</Th>
                          <Th>Message</Th>
                          <Th>Date</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {currentMessages.map((msg) => (
                          <Tr key={msg.id} className={msg.selected ? styles.fadedRow : ""}>
                            <Td>
                              <Checkbox isChecked={msg.selected} onChange={() => toggleSelect(msg.id)} />
                            </Td>
                            <Td className={msg.selected ? styles.fadedText : ""}>
                              <Flex className={styles.avatarContainer}>
                                <Avatar name={msg.sender} size="sm" bg="#596334" color="white" />
                                {msg.sender}
                              </Flex>
                            </Td>
                            <Td className={msg.selected ? styles.fadedText : ""}>{msg.message}</Td>
                            <Td className={msg.selected ? styles.fadedText : ""}>{msg.date}</Td>
                            <Td>
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  icon={<BsThreeDotsVertical />}
                                  className={styles.menuButton}
                                />
                                <MenuList>
                                  <MenuItem onClick={() => handleDelete(msg.id)}>Delete</MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>

                  {/* Pagination Controls */}
                  <Box className={styles.pageControls}>
                    <Button
                      className={styles.pageButton}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <Button
                        key={index + 1}
                        className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}

                    <Button
                      className={styles.pageButton}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </Box>
                </>
>>>>>>> f135f73 (fix: pagination controls are at constant position independent of messege-dependent table height)
              ) : (
                <p className={styles.sentMessage}>Sent messages here.</p>
              )}
            </div>
          </BrowserView>

          <MobileView>
            <div>
              <div style={{ overflowX: "hidden" }}>
                <div>
                  <div>
                    <div
                      style={{
                        position: "absolute",
                        marginLeft: "20px",
                        marginTop: "15px",
                      }}
                    >
                      <AlignJustify></AlignJustify>
                    </div>
                    {/* add tree icon */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <Image src="./logo1.png" alt="tree icon" height={"50px"}></Image>
                    </div>

                    <button
                      className={`${styles.tab} ${activeTab === "inbox" ? styles.activeTab : ""}`}
                      style={{ marginTop: "20px", marginLeft: "10px" }}
                      onClick={() => {
                        setActiveTab("inbox");
                        setCurrentPage(1);
                      }}
                    >
                      Inbox
                    </button>
                    <button
                      className={`${styles.tab} ${activeTab === "sent" ? styles.activeTab : ""}`}
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        setActiveTab("sent");
                        setCurrentPage(1);
                      }}
                    >
                      Sent
                    </button>
                  </div>
                  <button
                    className={styles.newMessageButton}
                    style={{
                      position: "fixed",
                      bottom: "20px",
                      right: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: "9",
                    }}
                  >
                    New Message +
                  </button>
                </div>

                {activeTab === "inbox" ? (
                  <>
                    <Stack backgroundColor={"white"} marginTop={7} borderRadius={10} padding={5} margin={3}>
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={msg.selected ? styles.fadedRow : ""}
                          onClick={() => toggleSelect(msg.id)}
                        >
                          <div className={msg.selected ? styles.fadedText : ""}>
                            <Flex alignItems={"center"}>
                              <Avatar name={msg.sender} size="md" bg="#596334" color="white" />
                              <div style={{ padding: "10px" }}>
                                <Flex justify="space-between">
                                  {msg.sender}
                                  <Text className={msg.selected ? styles.fadedText : ""}>{msg.date}</Text>
                                </Flex>
                                <Text
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                  }}
                                  className={msg.selected ? styles.fadedText : ""}
                                >
                                  {msg.message}
                                </Text>
                              </div>
                            </Flex>
                          </div>
                          <div style={{ marginTop: "5px" }}>
                            <Divider />
                          </div>
                        </div>
                      ))}
                    </Stack>

                    {/* Pagination Controls */}
                    <Box className={styles.pageControls} style={{ marginBottom: "70px" }}>
                      <Button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                          key={index + 1}
                          className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Button>
                      ))}

                      <Button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </Box>
                  </>
                ) : (
                  <p className={styles.sentMessage}>Sent messages here.</p>
                )}
              </div>
            </div>
          </MobileView>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Messages;
