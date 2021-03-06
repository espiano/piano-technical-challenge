# \TPPublisherResourceUserApi

All URIs are relative to *https://localhost/api/v3*

Method | HTTP request | Description
------------- | ------------- | -------------
[**listUsersRequest**](TPPublisherResourceUserApi.md#listUsersRequest) | **GET** /publisher/resource/user/list | Lists users of a resource


# **listUsersRequest**
> \model\TPPublisherUser[] listUsersRequest($aid, $rid, $offset, $limit, $q, $orderBy, $orderDirection)

Lists users of a resource



### Example 
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');

$api_instance = new \Api\TPPublisherResourceUserApi();
$aid = "aid_example"; // string | Application aid
$rid = "rid_example"; // string | Unique id for resource
$offset = 0; // int | Offset from which to start returning results
$limit = 25; // int | Maximum index of returned results
$q = "q_example"; // string | Search value
$orderBy = "orderBy_example"; // string | Field to order by
$orderDirection = "orderDirection_example"; // string | Order direction (asc/desc)

try { 
    $result = $api_instance->listUsersRequest($aid, $rid, $offset, $limit, $q, $orderBy, $orderDirection);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TPPublisherResourceUserApi->listUsersRequest: ', $e->getMessage(), "\n";
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **aid** | **string**| Application aid | 
 **rid** | **string**| Unique id for resource | 
 **offset** | **int**| Offset from which to start returning results | [default to 0]
 **limit** | **int**| Maximum index of returned results | [default to 25]
 **q** | **string**| Search value | [optional] 
 **orderBy** | **string**| Field to order by | [optional] 
 **orderDirection** | **string**| Order direction (asc/desc) | [optional] 

### Return type

[**\model\TPPublisherUser[]**](TPPublisherUser.md)

### Authorization

No authorization required

### HTTP reuqest headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

