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
import { useUser } from "@clerk/nextjs";
import { BrowserView, MobileView } from "react-device-detect";
import MessagePopUp from "@/components/MessagePopUp";

function Messages() {
  const messagesPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inbox");

  const { user, isLoaded } = useUser();

  let role = null;
  if (isLoaded && user) {
    role = user.organizationMemberships?.[0]?.role;
  }

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
  const isAdmin = role === "org:admin";
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
                {isAdmin && (
                  <button className={styles.newMessageButton} onClick={() => router.push("/createAnnouncement")}>
                    New Message +
                  </button>
                )}
              </div>

              {activeTab === "inbox" ? (
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
                        {/* Used to create whitespace on the last  */}
                        {Array.from({ length: 7 - currentMessages.length }).map((_, i) => (
                          <tr key={`empty-${i}`} style={{ height: "55px" }}>
                            <td colSpan={5} />
                          </tr>
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
              ) : (
                <p className={styles.sentMessage}>Sent messages here.</p>
              )}
            </div>
          </BrowserView>

          <MobileView>
            <Box padding="16px" overflowX="auto">
              <Text className={styles.header} textAlign="center">
                Messages
              </Text>
              <Text className={styles.unread} textAlign="center">
                {unreadCount} unread {unreadCount === 1 ? "announcement" : "announcements"}
              </Text>

              {/* Tabs */}
              <Flex
                className={styles.topBar}
                justify="space-between"
                align="center"
                marginBottom="20px"
                flexWrap="wrap"
              >
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

                {isAdmin && (
                  <button className={styles.newMessageButton} onClick={() => router.push("/createAnnouncement")}>
                    New Message +
                  </button>
                )}
              </Flex>

              {activeTab === "inbox" ? (
                <Box overflowX="auto">
                  <Table className={styles.table} size="sm">
                    <Thead className={styles.tableHeader}>
                      <Tr>
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
                                setOpenMessagePopUp(true);
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
                      {/* Fill blank rows if needed */}
                      {Array.from({ length: 7 - currentMessages.length }).map((_, i) => (
                        <Tr key={`empty-${i}`} style={{ height: "55px" }}>
                          <Td colSpan={5}></Td>
                        </Tr>
                      ))}
                    </Tbody>
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

                  {/* Message popup */}
                  {openMessagePopUp && (
                    <MessagePopUp
                      date={messageProps.date}
                      messageTitle={messageProps.messageTitle}
                      adminName={messageProps.adminName}
                      messageContent={messageProps.messageContent}
                      id={messageProps.id}
                    />
                  )}
                </Box>
              ) : (
                <Text className={styles.sentMessage}>Sent messages here.</Text>
              )}
            </Box>
          </MobileView>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Messages;
