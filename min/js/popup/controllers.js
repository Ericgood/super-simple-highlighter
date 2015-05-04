var popupControllers=angular.module("popupControllers",[]);popupControllers.controller("DocumentsController",["$scope",function($scope){"use strict";var backgroundPage,activeTab;$scope.manifest=chrome.runtime.getManifest(),_storage.highlightDefinitions.getAll(function(items){$scope.highlightDefinitions=items.highlightDefinitions}),$scope.styleFilterHighlightDefinition=null,$scope.styleFilterPredicate=function(doc){return $scope.styleFilterHighlightDefinition?doc.className===$scope.styleFilterHighlightDefinition.className:!0},chrome.tabs.query({active:!0,currentWindow:!0},function(result){chrome.runtime.getBackgroundPage(function(bgPage){activeTab=result[0],backgroundPage=bgPage,_storage.getPopupHighlightTextMaxLength(function(max){max&&($scope.popupHighlightTextMaxLength=max)}),_storage.getFileAccessRequiredWarningDismissed(function(dismissed){if(!dismissed){var u=purl(activeTab.url);dismissed="file"!==u.attr("protocol")}$scope.fileAccessRequiredWarningVisible=!dismissed}),$scope.$watch("fileAccessRequiredWarningVisible",function(newVal,oldVal){newVal!==oldVal&&_storage.setFileAccessRequiredWarningDismissed(!newVal)}),$scope.title=activeTab.title,$scope.match=backgroundPage._database.buildMatchString(activeTab.url),updateDocs()})}),$scope.onClickStyleFilter=function(event,definition){$scope.styleFilterHighlightDefinition=definition,event.stopPropagation()},$scope.onClickMore=function(event,doc){$("#"+doc._id+" .highlight-text").text(doc.text),event.preventDefault(),event.stopPropagation()},$scope.onClickHighlight=function(doc){doc.isInDOM&&backgroundPage._eventPage.scrollTo(activeTab.id,doc._id)},$scope.onClickSelect=function(doc){doc.isInDOM&&(backgroundPage._eventPage.selectHighlightText(activeTab.id,doc._id),window.close())},$scope.onClickCopy=function(documentId){backgroundPage._eventPage.copyHighlightText(documentId),window.close()},$scope.onClickSpeak=function(documentId){backgroundPage._eventPage.speakHighlightText(documentId)},$scope.onClickRedefinition=function(event,doc,index){var newDefinition=$scope.highlightDefinitions[index];backgroundPage._eventPage.updateHighlight(activeTab.id,doc._id,newDefinition.className),doc.className=newDefinition.className,event.stopPropagation()},$scope.onClickOpenOverviewInNewTab=function(){chrome.tabs.create({url:"overview.html?id="+activeTab.id+"&url="+encodeURIComponent(activeTab.url)+"&title="+encodeURIComponent($scope.title)})},$scope.onClickRemoveHighlight=function(event,documentId){backgroundPage._eventPage.deleteHighlight(activeTab.id,documentId,function(err,result){result&&result.ok&&updateDocs(function(err,docs){docs&&0===docs.length&&window.close()})}),event.stopPropagation()},$scope.onClickRemoveAllHighlights=function(){backgroundPage._eventPage.deleteHighlights(activeTab.id,$scope.match),window.close()},$scope.onClickDismissFileAccessRequiredWarning=function(){$scope.fileAccessRequiredWarningVisible=!1};var updateDocs=function(callback){backgroundPage._database.getCreateDocuments($scope.match,function(err,docs){err||($scope.docs=docs,$scope.$apply(),docs.forEach(function(doc){backgroundPage._eventPage.isHighlightInDOM(activeTab.id,doc._id,function(isInDOM){doc.isInDOM=isInDOM,$scope.$apply()})})),callback&&callback(err,docs)})}}]);