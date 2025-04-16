"use client";
import React, { useState } from "react";
import styles from "./messages.module.css";
import { useRouter } from "next/navigation";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Avatar,
  Checkbox,
  Button,
  Box,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

function Messages() {
  const messagesPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inbox");
  const router = useRouter();

  const [messages, setMessages] = useState(
    Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      sender: "Jane Doe",
      message: "Hi! This is a message sent to you...",
      date: "01.01.25",
      selected: false,
    })),
  );

  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null);

  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleSelect = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, selected: !msg.selected } : msg)),
    );
  };

  const handleDelete = (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Messages</h2>
      <p className={styles.unread}>7 unread announcements</p>
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
        <button className={styles.newMessageButton} onClick={() => router.push("/createAnnouncement/")}>
          New Message +
        </button>
      </div>

      {activeTab === "inbox" ? (
        <div className={styles.mainContent}>
          <Table className={styles.table}>
            <Thead className={styles.tableHeader}>
              <Tr className={styles.tableHeader}>
                <Th>Select</Th>
                <Th>Sender</Th>
                <Th>Message</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentMessages.map((msg) => (
                <Tr key={msg.id} className={styles.clickableRow}>
                  <Td>
                    <Checkbox isChecked={msg.selected} onChange={() => toggleSelect(msg.id)} />
                  </Td>
                  <Td className={`${msg.selected ? styles.fadedText : ""}`} onClick={() => setSelectedMessage(msg)}>
                    <Flex className={styles.avatarContainer}>
                      <Avatar name={msg.sender} size="sm" bg="#596334" color="white" />
                      {msg.sender}
                    </Flex>
                  </Td>
                  <Td className={`${msg.selected ? styles.fadedText : ""}`} onClick={() => setSelectedMessage(msg)}>
                    {msg.message}
                  </Td>
                  <Td className={msg.selected ? styles.fadedText : ""}>{msg.date}</Td>
                  <Td>
                    <Menu>
                      <MenuButton as={IconButton} icon={<BsThreeDotsVertical />} className={styles.menuButton} />
                      <MenuList>
                        <MenuItem onClick={() => handleDelete(msg.id)}>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            {/* Page Controls */}
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
          </Table>
          {selectedMessage && (
            <div className={styles.messageTable}>
              <div className={styles.messageHeader}>
                <h3>Message Title</h3>
                <p>Admin Name</p>
              </div>
              <div className={styles.messageBody}>
                <h1>MM/DD/YYYY</h1>
                <p>
                  Message contents... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. UT enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className={styles.sentMessage}>Sent messages here.</p>
      )}
    </div>
  );
}

export default Messages;
