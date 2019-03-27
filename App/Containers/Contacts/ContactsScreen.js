import React, { Component } from 'react';
import { View, Image, SectionList } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { isEmpty, path } from 'ramda';
import PropTypes from 'prop-types';

import Text from '../../Components/Text';
import HeaderAdd from '../../Components/HeaderAdd';
import Search from '../../Components/Search';

import { contactsToSectionList } from '../../Transforms/array';
import { ContactData } from '../../Realm';
import ContactsRow from '../../Components/ContactsRow';
import { addRealmCollectionListener } from '../../Realm/Utils';

// Styles
import { Images } from '../../Themes';
import styles from './Styles/ContactsScreenStyle';
import { AccountSelectors } from '../../Redux/AccountRedux';
import Types from '../../Config/Types';
import Button from '../../Components/Button';
import PrivacyModeView from '../../Components/PrivacyModeView';

class ContactsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const mode = navigation.getParam('privacyMode');
    const isLocked = mode === Types.MODE_STANDARD;
    const options = {
      headerTitle: (
        <PrivacyModeView style={styles.customHeader} lockStyle={styles.headerLockStyle}>
          <Text style={styles.headerTitleStyleWithMargin}>CONTACTS</Text>
        </PrivacyModeView>
      ),
      title: 'CONTACTS',
      headerBackTitle: null,
      headerRight: !isLocked ? (
        <HeaderAdd onPress={() => navigation.navigate('ContactsNew')} />
      ) : null,
    };

    if (navigation.getParam('hideHeader')) {
      options.header = null;
    }

    return options;
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    privacyMode: Types.MODE_PROPS,
  };

  static defaultProps = {
    privacyMode: null,
  };

  constructor(props) {
    super(props);

    this.contactsData = ContactData.getAll();
    // use setImmediate to fix realm crash in debug mode
    addRealmCollectionListener(this.contactsData, this.onContactsDataUpdate);

    this.state = {
      contacts: [],
      contactsLength: 0,
      showSearchShadow: false,
    };

    const { privacyMode } = this.props;
    this.props.navigation.setParams({
      privacyMode,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.privacyMode !== this.props.privacyMode) {
      this.props.navigation.setParams({ privacyMode: this.props.privacyMode });
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    this.contactsData.removeAllListeners();
  }

  onContactsDataUpdate = (collection) => {
    if (this.isUnmounted) {
      return;
    }
    this.transformContactsData(collection);
  };

  findContact(name) {
    this.contactsData.removeAllListeners();
    if (isEmpty(name)) {
      this.contactsData = ContactData.getAll();
    } else {
      this.contactsData = ContactData.filterByName(name);
    }
    addRealmCollectionListener(this.contactsData, this.onContactsDataUpdate);
    this.setState({ showSearchShadow: isEmpty(name) });
  }

  headleOnEndSearch = () => {
    this.setState({ showSearchShadow: false }, () => {
      this.props.navigation.setParams({ hideHeader: false });
    });
  };

  headleOnFocus = () => {
    this.setState({ showSearchShadow: true }, () => {
      this.props.navigation.setParams({ hideHeader: true });
    });
  };

  transformContactsData(data) {
    const contactsLength = data.length;
    const contacts = contactsToSectionList(data);

    this.setState({ contacts, contactsLength });
  }

  renderFooter = () => (
    <View style={styles.listFooterSection}>
      <Text style={styles.listFooterText}>
        {this.state.contactsLength} {this.state.contactsLength === 1 ? 'Contact' : 'Contacts'}
      </Text>
    </View>
  );

  renderContacts() {
    const { contacts } = this.state;
    const onPress = path(['state', 'params', 'onPress'], this.props.navigation);

    return (
      <SectionList
        stickySectionHeadersEnabled
        sections={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ContactsRow navigation={this.props.navigation} onPress={onPress} item={item} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
        ListFooterComponent={this.renderFooter()}
      />
    );
  }

  renderEmpty() {
    return (
      <View style={styles.placeholderContainer}>
        <View style={styles.placeholderSection}>
          <Image source={Images.contactsPlaceholder} style={styles.placeholderIcon} />
          <Text style={styles.placeholderText}>This will display all your contacts</Text>
        </View>
      </View>
    );
  }

  renderStandardState = () => (
    <SafeAreaView style={styles.container}>
      <Image source={Images.contactsPlaceholder} style={styles.standardIcon} />
      <Text style={styles.standardText}>Contact list is available only in the Extended Mode.</Text>
      <Button
        title="CHANGE PRIVACY MODE"
        style={styles.standardButton}
        onPress={() => this.props.navigation.push('PrivacyModeSelectScreen')}
      />
    </SafeAreaView>
  );
  render() {
    const { contacts } = this.state;
    const { privacyMode } = this.props;

    if (privacyMode === Types.MODE_STANDARD) {
      return this.renderStandardState();
    }

    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.searchContainer}>
          <Search
            onChangeText={text => this.findContact(text)}
            style={styles.search}
            onFocus={this.headleOnFocus}
            onEndSearch={this.headleOnEndSearch}
          />
        </View>
        <View style={styles.container}>
          {isEmpty(contacts) ? this.renderEmpty() : this.renderContacts()}
          {this.state.showSearchShadow && <View style={styles.searchShadow} />}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  privacyMode: AccountSelectors.getPrivacyMode(state),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactsScreen);
